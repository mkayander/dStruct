import type { FieldProps } from "formik/dist/Field";
import type {
  FieldValidator,
  GenericFieldHTMLAttributes,
} from "formik/dist/types";
import type React from "react";

declare module "formik" {
  export interface FieldConfig<V = any> {
    // /**
    //  * Field component to render. Can either be a string like 'select' or a component.
    //  */
    // component?:
    //     | string
    //     | React.ComponentType<FieldProps<V>>
    //     | React.ComponentType
    //     | React.ForwardRefExoticComponent<any>;
    /**
     * Component to render. Can either be a string e.g. 'select', 'input', or 'textarea', or a component.
     */
    as?:
      | React.ComponentType<FieldProps<V>["field"]>
      | string
      | React.ComponentType
      | React.ForwardRefExoticComponent<any>;
    /**
     * Render prop (works like React router's <Route render={props =>} />)
     * @deprecated
     */
    render?: (props: FieldProps<V>) => React.ReactNode;
    /**
     * Children render function <Field name>{props => ...}</Field>)
     */
    children?: ((props: FieldProps<V>) => React.ReactNode) | React.ReactNode;
    /**
     * Validate a single field value independently
     */
    validate?: FieldValidator;
    /**
     * Field name
     */
    name: string;
    /** HTML input type */
    type?: string;
    /** Field value */
    value?: any;
    /** Inner ref */
    innerRef?: (instance: any) => void;
  }

  export declare type FieldAttributes<
    T,
    C extends React.ComponentType,
  > = GenericFieldHTMLAttributes &
    FieldConfig<T> & {
      component?: C;
      name: string;
    } & React.ComponentPropsWithRef<C>;

  export declare function Field<C extends React.ComponentType>({
    validate,
    name,
    render,
    children,
    as: is, // `as` is reserved in typescript lol
    component,
    ...props
  }: FieldAttributes<any, C>): any;
}
