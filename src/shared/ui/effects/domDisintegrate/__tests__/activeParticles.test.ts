import { describe, expect, it } from "vitest";

import { createTestDisintegrateParticle } from "#/shared/ui/effects/domDisintegrate/__tests__/createTestDisintegrateParticle";
import { createActiveParticleTracker } from "#/shared/ui/effects/domDisintegrate/activeParticles";

describe("createActiveParticleTracker", () => {
  it("tracks only released particles for step and draw", () => {
    const particles = [
      createTestDisintegrateParticle({ releaseTime: 0 }),
      createTestDisintegrateParticle({ releaseTime: 0.5 }),
    ];
    const tracker = createActiveParticleTracker(particles);

    tracker.syncReleased(0.1);

    expect(tracker.getActive()).toHaveLength(1);
    expect(tracker.getVisibleCount()).toBe(2);
  });

  it("drops faded particles from the active list", () => {
    const particle = createTestDisintegrateParticle({ releaseTime: 0 });
    const tracker = createActiveParticleTracker([particle]);

    tracker.syncReleased(0.1);
    particle.alpha = 0;

    tracker.removeDead();

    expect(tracker.getActive()).toHaveLength(0);
    expect(tracker.getVisibleCount()).toBe(0);
  });
});
