/**
 * Upgrades low-quality `pythonCode` in a playground dump:
 * - Replaces `def solve(...): return first_arg` stubs with real snippets for known slugs.
 * - Applies category-aware defaults for common multi-arg type signatures.
 *
 * Run: `pnpm upgrade-dump-python` or `pnpm exec tsx src/scripts/upgradeMainDumpPython.ts [path]`
 */
import { promises as fs } from "fs";
import { join } from "path";

type DumpArg = { name: string; type: string; order: number };
type DumpTestCase = {
  projectId: string;
  slug: string;
  order: number;
  args: Record<string, DumpArg>;
};
type DumpSolution = {
  id: string;
  projectId: string;
  pythonCode: string | null;
  updatedAt: string;
};
type DumpProject = { id: string; slug: string; category: string };
type DumpFile = {
  projects: Record<string, DumpProject>;
  testCases: Record<string, DumpTestCase>;
  solutions: Record<string, DumpSolution>;
};

function sortedArgs(testCase: DumpTestCase): DumpArg[] {
  return Object.values(testCase.args ?? {}).toSorted((left, right) => {
    if (left.order !== right.order) return left.order - right.order;
    return left.name.localeCompare(right.name);
  });
}

function pickReferenceTestCase(
  testCases: DumpTestCase[],
): DumpTestCase | undefined {
  const ordered = testCases.toSorted((left, right) => {
    if (left.order !== right.order) return left.order - right.order;
    return left.slug.localeCompare(right.slug);
  });
  return ordered.length > 0 ? ordered[0] : undefined;
}

function argTypeKey(args: DumpArg[]): string {
  return args.map((arg) => arg.type).join(",");
}

/** True for `def solve(a, b): return a` style stubs (single-line body return first param). */
function isSolveReturnFirstStub(code: string): boolean {
  const normalized = code.replace(/\r\n/g, "\n").trim();
  if (!/^def solve\(/m.test(normalized)) return false;
  const lines = normalized.split("\n").map((line) => line.trim());
  if (lines.length !== 2) return false;
  const body = lines[1];
  if (body === undefined) return false;
  return /^return [a-zA-Z_][a-zA-Z0-9_]*$/.test(body);
}

function isNaiveTreeSum(code: string): boolean {
  const normalized = code.replace(/\r\n/g, "\n");
  return (
    /^def run\(/m.test(normalized) &&
    /left_sum = run\([^)]+\.left\)/.test(normalized) &&
    /return [a-zA-Z0-9_]+\.val \+ left_sum \+ right_sum/.test(normalized)
  );
}

function isNaiveArraySum(code: string): boolean {
  const normalized = code.replace(/\r\n/g, "\n");
  return (
    /^def run\(/m.test(normalized) &&
    /total \+= .*?\[idx\]/.test(normalized) &&
    normalized.includes("return total")
  );
}

type UpgradeFn = (params: string[]) => string;

const SLUG_PYTHON: Record<string, { arity: number; build: UpgradeFn }> = {
  "same-tree": {
    arity: 2,
    build: ([tree_a, tree_b]) =>
      `def run(${tree_a}, ${tree_b}):\r\n  stack = [(${tree_a}, ${tree_b})]\r\n  while stack:\r\n    node_a, node_b = stack.pop()\r\n    if node_a is None and node_b is None:\r\n      continue\r\n    if node_a is None or node_b is None:\r\n      return False\r\n    node_a.setColor("green", "blink")\r\n    node_b.setColor("green", "blink")\r\n    if node_a.val != node_b.val:\r\n      node_a.setColor("red")\r\n      node_b.setColor("red")\r\n      return False\r\n    stack.append((node_a.right, node_b.right))\r\n    stack.append((node_a.left, node_b.left))\r\n  return True\r\n`,
  },
  "leaf-similar-trees": {
    arity: 2,
    build: ([tree_a, tree_b]) =>
      `def run(${tree_a}, ${tree_b}):\r\n  def collect_leaves(node, out):\r\n    if node is None:\r\n      return\r\n    if node.left is None and node.right is None:\r\n      node.setColor("green")\r\n      out.append(node.val)\r\n      return\r\n    node.setColor("cyan")\r\n    collect_leaves(node.left, out)\r\n    collect_leaves(node.right, out)\r\n\r\n  left_vals = []\r\n  right_vals = []\r\n  collect_leaves(${tree_a}, left_vals)\r\n  collect_leaves(${tree_b}, right_vals)\r\n  return left_vals == right_vals\r\n`,
  },
  "subtree-of-another-tree": {
    arity: 2,
    build: ([root, sub]) =>
      `def run(${root}, ${sub}):\r\n  def same_tree(node_a, node_b):\r\n    if node_a is None and node_b is None:\r\n      return True\r\n    if node_a is None or node_b is None:\r\n      return False\r\n    return (\r\n      node_a.val == node_b.val\r\n      and same_tree(node_a.left, node_b.left)\r\n      and same_tree(node_a.right, node_b.right)\r\n    )\r\n\r\n  def dfs(node):\r\n    if node is None:\r\n      return False\r\n    node.setColor("cyan")\r\n    if same_tree(node, ${sub}):\r\n      node.setColor("green")\r\n      return True\r\n    return dfs(node.left) or dfs(node.right)\r\n\r\n  return dfs(${root})\r\n`,
  },
  "same-linked-lists": {
    arity: 2,
    build: ([list_a, list_b]) =>
      `def run(${list_a}, ${list_b}):\r\n  node_a = ${list_a}\r\n  node_b = ${list_b}\r\n  while node_a and node_b:\r\n    if node_a.val != node_b.val:\r\n      node_a.setColor("red")\r\n      node_b.setColor("red")\r\n      return False\r\n    node_a.setColor("cyan", "blink")\r\n    node_b.setColor("cyan", "blink")\r\n    node_a = node_a.next\r\n    node_b = node_b.next\r\n  return node_a is None and node_b is None\r\n`,
  },
  "merge-sorted-linked-lists": {
    arity: 2,
    build: ([list_a, list_b]) =>
      `def run(${list_a}, ${list_b}):\r\n  dummy = ListNode(0)\r\n  tail = dummy\r\n  node_a = ${list_a}\r\n  node_b = ${list_b}\r\n  while node_a and node_b:\r\n    if node_a.val <= node_b.val:\r\n      node_a.setColor("green")\r\n      tail.next = node_a\r\n      tail = node_a\r\n      node_a = node_a.next\r\n    else:\r\n      node_b.setColor("green")\r\n      tail.next = node_b\r\n      tail = node_b\r\n      node_b = node_b.next\r\n    tail.next = None\r\n  rest = node_a if node_a else node_b\r\n  while rest:\r\n    rest.setColor("cyan")\r\n    tail.next = rest\r\n    tail = rest\r\n    rest = rest.next\r\n    tail.next = None\r\n  return dummy.next\r\n`,
  },
  "merge-k-sorted-lists": {
    arity: 3,
    build: ([list_a, list_b, list_c]) =>
      `def run(${list_a}, ${list_b}, ${list_c}):\r\n  heads = [head for head in (${list_a}, ${list_b}, ${list_c}) if head is not None]\r\n  dummy = ListNode(0)\r\n  tail = dummy\r\n  while len(heads) > 0:\r\n    best_index = 0\r\n    for idx in range(1, len(heads)):\r\n      if heads[idx].val < heads[best_index].val:\r\n        best_index = idx\r\n    chosen = heads[best_index]\r\n    chosen.setColor("green")\r\n    tail.next = chosen\r\n    tail = chosen\r\n    if chosen.next is None:\r\n      heads.pop(best_index)\r\n    else:\r\n      heads[best_index] = chosen.next\r\n    tail.next = None\r\n  return dummy.next\r\n`,
  },
  "kth-smallest-element-in-a-bst": {
    arity: 2,
    build: ([root, rank]) =>
      `def run(${root}, ${rank}):\r\n  stack = []\r\n  node = ${root}\r\n  count = 0\r\n  while True:\r\n    while node is not None:\r\n      node.setColor("cyan")\r\n      stack.append(node)\r\n      node = node.left\r\n    node = stack.pop()\r\n    node.setColor("green", "blink")\r\n    count += 1\r\n    if count == ${rank}:\r\n      return node.val\r\n    node = node.right\r\n`,
  },
  "path-sum-3": {
    arity: 2,
    build: ([root, target]) =>
      `def run(${root}, ${target}):\r\n  counts = {0: 1}\r\n  result = 0\r\n\r\n  def dfs(node, prefix_sum):\r\n    nonlocal result\r\n    if node is None:\r\n      return\r\n    node.setColor("cyan", "blink")\r\n    prefix_sum += node.val\r\n    if prefix_sum == ${target}:\r\n      result += 1\r\n      node.setColor("green")\r\n    need = prefix_sum - ${target}\r\n    result += counts.get(need, 0)\r\n    counts[prefix_sum] = counts.get(prefix_sum, 0) + 1\r\n    dfs(node.left, prefix_sum)\r\n    dfs(node.right, prefix_sum)\r\n    counts[prefix_sum] -= 1\r\n    if counts[prefix_sum] == 0:\r\n      del counts[prefix_sum]\r\n\r\n  dfs(${root}, 0)\r\n  return result\r\n`,
  },
  "path-sum-ii": {
    arity: 2,
    build: ([root, target]) =>
      `def run(${root}, ${target}):\r\n  output = []\r\n  path = []\r\n\r\n  def dfs(node, remaining):\r\n    if node is None:\r\n      return\r\n    node.setColor("cyan", "blink")\r\n    path.append(node.val)\r\n    if node.left is None and node.right is None and remaining == node.val:\r\n      node.setColor("green")\r\n      output.append(list(path))\r\n    else:\r\n      dfs(node.left, remaining - node.val)\r\n      dfs(node.right, remaining - node.val)\r\n    path.pop()\r\n\r\n  dfs(${root}, ${target})\r\n  return output\r\n`,
  },
  "amount-of-time-for-binary-tree-to-be-infected": {
    arity: 2,
    build: ([root, start]) =>
      `def run(${root}, ${start}):\r\n  best = 0\r\n\r\n  def dfs(node):\r\n    nonlocal best\r\n    if node is None:\r\n      return 0, -1\r\n    node.blink()\r\n    left_height, left_start = dfs(node.left)\r\n    right_height, right_start = dfs(node.right)\r\n    height = left_height\r\n    if right_height > height:\r\n      height = right_height\r\n    start_dist = -1\r\n    if left_start > -1:\r\n      node.setColor("green")\r\n      candidate = left_start\r\n      if left_start + right_height > candidate:\r\n        candidate = left_start + right_height\r\n      if candidate > best:\r\n        best = candidate\r\n      start_dist = left_start + 1\r\n    elif right_start > -1:\r\n      node.setColor("green")\r\n      candidate = right_start\r\n      if left_height + right_start > candidate:\r\n        candidate = left_height + right_start\r\n      if candidate > best:\r\n        best = candidate\r\n      start_dist = right_start + 1\r\n    elif node.val == ${start}:\r\n      node.setColor("red")\r\n      start_dist = 1\r\n      if height > best:\r\n        best = height\r\n    return height + 1, start_dist\r\n\r\n  dfs(${root})\r\n  return best\r\n`,
  },
  "remove-nth-node-from-end-of-list": {
    arity: 2,
    build: ([head, nth]) =>
      `def run(${head}, ${nth}):\r\n  length = 0\r\n  cursor = ${head}\r\n  while cursor is not None:\r\n    length += 1\r\n    cursor = cursor.next\r\n  skip = length - ${nth}\r\n  dummy = ListNode(0, ${head})\r\n  previous = dummy\r\n  for _ in range(skip):\r\n    previous = previous.next\r\n  previous.next = previous.next.next\r\n  return dummy.next\r\n`,
  },
  "partition-list": {
    arity: 2,
    build: ([head, pivot]) =>
      `def run(${head}, ${pivot}):\r\n  less_head = ListNode(0)\r\n  greater_head = ListNode(0)\r\n  less_tail = less_head\r\n  greater_tail = greater_head\r\n  node = ${head}\r\n  while node is not None:\r\n    if node.val < ${pivot}:\r\n      less_tail.next = node\r\n      less_tail = node\r\n    else:\r\n      greater_tail.next = node\r\n      greater_tail = node\r\n    node = node.next\r\n  greater_tail.next = None\r\n  less_tail.next = greater_head.next\r\n  return less_head.next\r\n`,
  },
  "reverse-nodes-in-k-group": {
    arity: 2,
    build: ([head, group_size]) =>
      `def run(${head}, ${group_size}):\r\n  def reverse_range(start_node, count):\r\n    previous = None\r\n    current = start_node\r\n    for _ in range(count):\r\n      nxt = current.next\r\n      current.next = previous\r\n      previous = current\r\n      current = nxt\r\n    return previous, current\r\n\r\n  length = 0\r\n  probe = ${head}\r\n  while probe is not None:\r\n    length += 1\r\n    probe = probe.next\r\n  dummy = ListNode(0, ${head})\r\n  group_prev = dummy\r\n  remaining = length\r\n  while remaining >= ${group_size}:\r\n    group_start = group_prev.next\r\n    new_head, after = reverse_range(group_start, ${group_size})\r\n    group_prev.next = new_head\r\n    group_start.next = after\r\n    group_prev = group_start\r\n    remaining -= ${group_size}\r\n  return dummy.next\r\n`,
  },
  "swapping-nodes-in-a-linked-list": {
    arity: 2,
    build: ([head, swap_rank]) =>
      `def run(${head}, ${swap_rank}):\r\n  length = 0\r\n  cursor = ${head}\r\n  while cursor is not None:\r\n    length += 1\r\n    cursor = cursor.next\r\n  from_start = ${swap_rank}\r\n  from_end = length - ${swap_rank} + 1\r\n  if from_start > from_end:\r\n    from_start, from_end = from_end, from_start\r\n  first = ${head}\r\n  for _ in range(from_start - 1):\r\n    first = first.next\r\n  second = ${head}\r\n  for _ in range(from_end - 1):\r\n    second = second.next\r\n  first.setColor("green")\r\n  second.setColor("green")\r\n  first.val, second.val = second.val, first.val\r\n  return ${head}\r\n`,
  },
  "insert-into-a-sorted-circular-linked-list": {
    arity: 2,
    build: ([head, insert_val]) =>
      `def run(${head}, ${insert_val}):\r\n  node = ListNode(${insert_val})\r\n  if ${head} is None:\r\n    node.next = node\r\n    return node\r\n  current = ${head}\r\n  while True:\r\n    current.setColor("cyan")\r\n    nxt = current.next\r\n    if current.val <= ${insert_val} <= nxt.val:\r\n      break\r\n    if current.val > nxt.val and (${insert_val} >= current.val or ${insert_val} <= nxt.val):\r\n      break\r\n    current = nxt\r\n    if current is ${head}:\r\n      break\r\n  node.next = current.next\r\n  current.next = node\r\n  current.setColor("green")\r\n  return ${head} if ${insert_val} > ${head}.val else node\r\n`,
  },
  "split-linked-list-in-parts": {
    arity: 2,
    build: ([head, parts]) =>
      `def run(${head}, ${parts}):\r\n  length = 0\r\n  cursor = ${head}\r\n  while cursor is not None:\r\n    length += 1\r\n    cursor = cursor.next\r\n  base = length // ${parts}\r\n  extra = length % ${parts}\r\n  output = []\r\n  current = ${head}\r\n  for index in range(${parts}):\r\n    size = base + (1 if index < extra else 0)\r\n    if size == 0:\r\n      output.append(None)\r\n      continue\r\n    part_head = current\r\n    for step in range(size - 1):\r\n      current.setColor("cyan")\r\n      current = current.next\r\n    current.setColor("green")\r\n    nxt = current.next\r\n    current.next = None\r\n    current = nxt\r\n    output.append(part_head)\r\n  return output\r\n`,
  },
  "kth-largest-element-in-an-array": {
    arity: 2,
    build: ([arr, rank]) =>
      `def run(${arr}, ${rank}):\r\n  values = []\r\n  for idx in range(len(${arr})):\r\n    values.append(${arr}[idx])\r\n  values.sort()\r\n  k = int(${rank})\r\n  if k <= 0 or k > len(values):\r\n    return None\r\n  return values[len(values) - k]\r\n`,
  },
  "target-sum": {
    arity: 2,
    build: ([nums, goal]) =>
      `def run(${nums}, ${goal}):\r\n  ways = 0\r\n  length = len(${nums})\r\n\r\n  def dfs(index, current):\r\n    nonlocal ways\r\n    if index == length:\r\n      if current == ${goal}:\r\n        ways += 1\r\n      return\r\n    dfs(index + 1, current + ${nums}[index])\r\n    dfs(index + 1, current - ${nums}[index])\r\n\r\n  dfs(0, 0)\r\n  return ways\r\n`,
  },
  "two-sum-bsts": {
    arity: 3,
    build: ([root_one, root_two, goal]) =>
      `def run(${root_one}, ${root_two}, ${goal}):\r\n  values = set()\r\n\r\n  def collect(node):\r\n    if node is None:\r\n      return\r\n    collect(node.left)\r\n    node.setColor("cyan")\r\n    values.add(node.val)\r\n    collect(node.right)\r\n\r\n  collect(${root_one})\r\n  found = False\r\n\r\n  def search(node):\r\n    nonlocal found\r\n    if node is None:\r\n      return\r\n    node.setColor("green", "blink")\r\n    need = ${goal} - node.val\r\n    if need in values:\r\n      found = True\r\n    search(node.left)\r\n    search(node.right)\r\n\r\n  search(${root_two})\r\n  return found\r\n`,
  },
  "combination-sum-iv": {
    arity: 2,
    build: ([nums, target]) =>
      `def run(${nums}, ${target}):\r\n  goal = int(${target})\r\n  ways = [0] * (goal + 1)\r\n  ways[0] = 1\r\n  for total in range(1, goal + 1):\r\n    for idx in range(len(${nums})):\r\n      coin = int(${nums}[idx])\r\n      if coin <= total:\r\n        ways[total] += ways[total - coin]\r\n  return ways[goal]\r\n`,
  },
  "allocate-mailboxes": {
    arity: 2,
    build: ([houses, mailbox_count]) =>
      `def run(${houses}, ${mailbox_count}):\r\n  sorted_houses = []\r\n  for idx in range(len(${houses})):\r\n    sorted_houses.append(int(${houses}[idx]))\r\n  sorted_houses.sort()\r\n  k = int(${mailbox_count})\r\n  n = len(sorted_houses)\r\n  if k >= n:\r\n    return 0\r\n  cost = [[0] * n for _ in range(n)]\r\n  for left in range(n):\r\n    for right in range(left, n):\r\n      median = sorted_houses[(left + right) // 2]\r\n      dist_sum = 0\r\n      for idx in range(left, right + 1):\r\n        value = sorted_houses[idx]\r\n        if value > median:\r\n          dist_sum += value - median\r\n        else:\r\n          dist_sum += median - value\r\n      cost[left][right] = dist_sum\r\n  big = 10**18\r\n  dp = [[big] * (k + 1) for _ in range(n)]\r\n  for idx in range(n):\r\n    dp[idx][1] = cost[0][idx]\r\n  for mailboxes in range(2, k + 1):\r\n    for end in range(mailboxes - 1, n):\r\n      for split in range(mailboxes - 2, end):\r\n        candidate = dp[split][mailboxes - 1] + cost[split + 1][end]\r\n        if candidate < dp[end][mailboxes]:\r\n          dp[end][mailboxes] = candidate\r\n  return dp[n - 1][k]\r\n`,
  },
  "maximum-number-of-events-that-can-be-attended-ii": {
    arity: 2,
    build: ([events_flat, max_events]) =>
      `def run(${events_flat}, ${max_events}):\r\n  row_len = 3\r\n  total = len(${events_flat})\r\n  if total % row_len != 0:\r\n    return 0\r\n  events_rows = []\r\n  for start in range(0, total, row_len):\r\n    events_rows.append(\r\n      (\r\n        int(${events_flat}[start]),\r\n        int(${events_flat}[start + 1]),\r\n        int(${events_flat}[start + 2]),\r\n      )\r\n    )\r\n  events_rows.sort(key=lambda item: item[1])\r\n  k = int(${max_events})\r\n  n = len(events_rows)\r\n  dp = [0] * (k + 1)\r\n  ends = [[] for _ in range(k + 1)]\r\n  for index in range(n):\r\n    start_day, end_day, weight = events_rows[index]\r\n    for count in range(k, 0, -1):\r\n      best_prev = 0\r\n      row = ends[count - 1]\r\n      low = 0\r\n      high = len(row) - 1\r\n      while low <= high:\r\n        mid = (low + high) // 2\r\n        if row[mid][0] < start_day:\r\n          best_prev = row[mid][1]\r\n          low = mid + 1\r\n        else:\r\n          high = mid - 1\r\n      candidate = best_prev + weight\r\n      if candidate > dp[count]:\r\n        dp[count] = candidate\r\n        row.append((end_day, candidate))\r\n  return dp[k]\r\n`,
  },
  "path-with-maximum-probability": {
    arity: 5,
    build: ([node_count, edges, edge_prob, start_node, end_node]) =>
      `def run(${node_count}, ${edges}, ${edge_prob}, ${start_node}, ${end_node}):\r\n  n = int(${node_count})\r\n  start = int(${start_node})\r\n  end = int(${end_node})\r\n  best = [-1.0] * n\r\n  best[start] = 1.0\r\n  for _ in range(n):\r\n    for idx in range(len(${edges})):\r\n      edge = ${edges}[idx]\r\n      u = int(edge[0])\r\n      v = int(edge[1])\r\n      weight = float(${edge_prob}[idx])\r\n      if best[u] < 0:\r\n        continue\r\n      candidate = best[u] * weight\r\n      if candidate > best[v]:\r\n        best[v] = candidate\r\n  result = best[end]\r\n  if result < 0:\r\n    return 0.0\r\n  return result\r\n`,
  },
};

function buildMultiArgDefault(
  category: string,
  args: DumpArg[],
  paramNames: string[],
): string | undefined {
  const types = argTypeKey(args);
  const joinParams = () => paramNames.join(", ");

  if (types === "array,number") {
    const [arr, num] = paramNames;
    if (category === "DYNAMIC_PROGRAMMING") {
      return undefined;
    }
    if (category === "SLIDING_WINDOW" || category === "BINARY_SEARCH") {
      return `def run(${joinParams()}):\r\n  target = int(${num})\r\n  left = 0\r\n  total = 0\r\n  best = 0\r\n  for right in range(len(${arr})):\r\n    total += ${arr}[right]\r\n    while total > target and left <= right:\r\n      total -= ${arr}[left]\r\n      left += 1\r\n    window = right - left + 1\r\n    if window > best:\r\n      best = window\r\n  return best\r\n`;
    }
    if (category === "HEAP") {
      return `def run(${joinParams()}):\r\n  k = int(${num})\r\n  values = []\r\n  for idx in range(len(${arr})):\r\n    values.append(${arr}[idx])\r\n  values.sort()\r\n  if k <= 0 or k > len(values):\r\n    return None\r\n  return values[len(values) - k]\r\n`;
    }
    return `def run(${joinParams()}):\r\n  limit = int(${num})\r\n  count = 0\r\n  for idx in range(len(${arr})):\r\n    if ${arr}[idx] == limit:\r\n      count += 1\r\n  return count\r\n`;
  }

  if (types === "string,number") {
    const [text, num] = paramNames;
    if (category === "SLIDING_WINDOW") {
      return `def run(${joinParams()}):\r\n  k = int(${num})\r\n  if k <= 0 or k > len(${text}):\r\n    return 0\r\n  freq = {}\r\n  best = 0\r\n  left = 0\r\n  for right in range(len(${text})):\r\n    ch = ${text}[right]\r\n    freq[ch] = freq.get(ch, 0) + 1\r\n    most_common = 0\r\n    for count in freq.values():\r\n      if count > most_common:\r\n        most_common = count\r\n    while right - left + 1 - most_common > k:\r\n      left_ch = ${text}[left]\r\n      freq[left_ch] -= 1\r\n      if freq[left_ch] == 0:\r\n        del freq[left_ch]\r\n      left += 1\r\n      most_common = 0\r\n      for count in freq.values():\r\n        if count > most_common:\r\n          most_common = count\r\n    window = right - left + 1\r\n    if window > best:\r\n      best = window\r\n  return best\r\n`;
    }
    return `def run(${joinParams()}):\r\n  k = int(${num})\r\n  return ${text}[:k]\r\n`;
  }

  if (types === "string,string") {
    const [left_text, right_text] = paramNames;
    if (category === "DYNAMIC_PROGRAMMING") {
      return `def run(${joinParams()}):\r\n  rows = len(${left_text}) + 1\r\n  cols = len(${right_text}) + 1\r\n  previous = [0] * cols\r\n  for row in range(1, rows):\r\n    current = [0] * cols\r\n    for col in range(1, cols):\r\n      if ${left_text}[row - 1] == ${right_text}[col - 1]:\r\n        current[col] = previous[col - 1] + 1\r\n      else:\r\n        up = previous[col]\r\n        left_val = current[col - 1]\r\n        current[col] = up if up > left_val else left_val\r\n    previous = current\r\n  return previous[cols - 1]\r\n`;
    }
    if (category === "ARRAY") {
      return `def run(${joinParams()}):\r\n  output = []\r\n  left_index = 0\r\n  right_index = 0\r\n  use_left = True\r\n  while left_index < len(${left_text}) or right_index < len(${right_text}):\r\n    if use_left and left_index < len(${left_text}):\r\n      output.append(${left_text}[left_index])\r\n      left_index += 1\r\n    elif right_index < len(${right_text}):\r\n      output.append(${right_text}[right_index])\r\n      right_index += 1\r\n    use_left = not use_left\r\n  return "".join(output)\r\n`;
    }
    return `def run(${joinParams()}):\r\n  return ${left_text} + ${right_text}\r\n`;
  }

  if (types === "array,array") {
    const [first, second] = paramNames;
    if (category === "DYNAMIC_PROGRAMMING") {
      return `def run(${joinParams()}):\r\n  rows = len(${first}) + 1\r\n  cols = len(${second}) + 1\r\n  dp = [0] * cols\r\n  for row in range(1, rows):\r\n    next_row = [0] * cols\r\n    for col in range(1, cols):\r\n      if ${first}[row - 1] == ${second}[col - 1]:\r\n        next_row[col] = dp[col - 1] + 1\r\n      else:\r\n        up = dp[col]\r\n        left_val = next_row[col - 1]\r\n        next_row[col] = up if up > left_val else left_val\r\n    dp = next_row\r\n  return dp[cols - 1]\r\n`;
    }
    return `def run(${joinParams()}):\r\n  total = 0\r\n  limit = len(${first})\r\n  if len(${second}) < limit:\r\n    limit = len(${second})\r\n  for idx in range(limit):\r\n    total += ${first}[idx] + ${second}[idx]\r\n  return total\r\n`;
  }

  if (types === "number,array") {
    const [count, arr] = paramNames;
    if (category === "GRAPH") {
      return `def run(${joinParams()}):\r\n  n = int(${count})\r\n  visited = [False] * n\r\n  stack = [0]\r\n  while len(stack) > 0:\r\n    node = stack.pop()\r\n    if visited[node]:\r\n      continue\r\n    visited[node] = True\r\n    for nxt in ${arr}[node]:\r\n      stack.append(nxt)\r\n  return sum(1 for seen in visited if seen)\r\n`;
    }
    return `def run(${joinParams()}):\r\n  k = int(${count})\r\n  total = 0\r\n  for idx in range(len(${arr})):\r\n    total += ${arr}[idx]\r\n  return total // k if k != 0 else total\r\n`;
  }

  if (types === "string,array") {
    const [text, arr] = paramNames;
    return `def run(${joinParams()}):\r\n  total = 0\r\n  for token in ${arr}:\r\n    if token in ${text}:\r\n      total += 1\r\n  return total\r\n`;
  }

  if (types === "array,number,number") {
    const [arr, left, right] = paramNames;
    return `def run(${joinParams()}):\r\n  lo = int(${left})\r\n  hi = int(${right})\r\n  total = 0\r\n  for idx in range(len(${arr})):\r\n    value = ${arr}[idx]\r\n    if lo <= value <= hi:\r\n      total += value\r\n  return total\r\n`;
  }

  if (types === "number,number") {
    const [left, right] = paramNames;
    return `def run(${joinParams()}):\r\n  return int(${left}) + int(${right})\r\n`;
  }

  if (types === "number,number,number") {
    const [left, mid, right] = paramNames;
    return `def run(${joinParams()}):\r\n  return int(${left}) * int(${mid}) * int(${right})\r\n`;
  }

  return undefined;
}

function sanitizePythonIdentifier(name: string, fallback: string): string {
  const PYTHON_KEYWORDS = new Set([
    "and",
    "as",
    "assert",
    "async",
    "await",
    "break",
    "class",
    "continue",
    "def",
    "del",
    "elif",
    "else",
    "except",
    "False",
    "finally",
    "for",
    "from",
    "global",
    "if",
    "import",
    "in",
    "is",
    "lambda",
    "None",
    "nonlocal",
    "not",
    "or",
    "pass",
    "raise",
    "return",
    "True",
    "try",
    "while",
    "with",
    "yield",
  ]);
  const cleaned = name.replace(/[^a-zA-Z0-9_]/g, "_");
  const base = cleaned.length > 0 ? cleaned : fallback;
  const withPrefix = /^[0-9]/.test(base) ? `arg_${base}` : base;
  if (PYTHON_KEYWORDS.has(withPrefix)) {
    return `${withPrefix}_`;
  }
  return withPrefix;
}

async function main(): Promise<void> {
  const dumpPath =
    process.argv[2] ?? join(process.cwd(), "public-dumps/main.json");
  const raw = await fs.readFile(dumpPath, "utf8");
  const data = JSON.parse(raw) as DumpFile;

  const testCasesByProject = new Map<string, DumpTestCase[]>();
  for (const testCase of Object.values(data.testCases)) {
    const list = testCasesByProject.get(testCase.projectId) ?? [];
    list.push(testCase);
    testCasesByProject.set(testCase.projectId, list);
  }

  const now = new Date().toISOString();
  let upgraded = 0;

  for (const solution of Object.values(data.solutions)) {
    const code = solution.pythonCode ?? "";
    const project = data.projects[solution.projectId];
    if (!project) continue;

    const testCases = testCasesByProject.get(solution.projectId) ?? [];
    const reference = pickReferenceTestCase(testCases);
    if (!reference) continue;

    const args = sortedArgs(reference);
    const paramNames = args.map((arg, index) =>
      sanitizePythonIdentifier(arg.name, `arg${index}`),
    );

    let nextCode: string | undefined;

    const slugEntry = SLUG_PYTHON[project.slug];
    if (slugEntry && paramNames.length === slugEntry.arity) {
      nextCode = slugEntry.build(paramNames);
    }

    if (!nextCode && isSolveReturnFirstStub(code)) {
      nextCode = buildMultiArgDefault(project.category, args, paramNames);
    }

    if (
      !nextCode &&
      isNaiveTreeSum(code) &&
      project.slug === "minimize-maximum-of-array"
    ) {
      const arr = paramNames[0] ?? "array";
      nextCode = `def run(${arr}):\r\n  answer = 0\r\n  prefix = 0\r\n  for idx in range(len(${arr})):\r\n    prefix += ${arr}[idx]\r\n    candidate = (prefix + idx) // (idx + 1)\r\n    if candidate > answer:\r\n      answer = candidate\r\n    ${arr}[idx] += 1\r\n  return answer\r\n`;
    }

    if (!nextCode && isNaiveArraySum(code)) {
      const soleArg = args.length === 1 ? args[0] : undefined;
      const singleType = soleArg?.type ?? "";
      if (singleType === "array" || singleType === "matrix") {
        const multiDefault = buildMultiArgDefault(
          project.category,
          args,
          paramNames,
        );
        if (multiDefault) {
          nextCode = multiDefault;
        } else if (project.category === "DYNAMIC_PROGRAMMING") {
          const arr = paramNames[0] ?? "array";
          nextCode = `def run(${arr}):\r\n  if len(${arr}) == 0:\r\n    return 0\r\n  best = ${arr}[0]\r\n  current = ${arr}[0]\r\n  for idx in range(1, len(${arr})):\r\n    value = ${arr}[idx]\r\n    if value > current + value:\r\n      current = value\r\n    else:\r\n      current = current + value\r\n    if current > best:\r\n      best = current\r\n  return best\r\n`;
        }
      }
    }

    if (nextCode && nextCode !== code) {
      solution.pythonCode = nextCode;
      solution.updatedAt = now;
      upgraded += 1;
    }
  }

  await fs.writeFile(dumpPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log(`Upgraded pythonCode on ${upgraded} solutions in ${dumpPath}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
