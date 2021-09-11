import { Control, DeepPartial, FieldPath, FieldPathValue, FieldPathValues, FieldValues, UnpackNestedValue } from './types';
export declare function useWatch<TFieldValues extends FieldValues = FieldValues>(props: {
    defaultValue?: UnpackNestedValue<DeepPartial<TFieldValues>>;
    control?: Control<TFieldValues>;
    disabled?: boolean;
}): UnpackNestedValue<DeepPartial<TFieldValues>>;
export declare function useWatch<TFieldValues extends FieldValues = FieldValues, TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(props: {
    name: TFieldName;
    defaultValue?: FieldPathValue<TFieldValues, TFieldName>;
    control?: Control<TFieldValues>;
    disabled?: boolean;
}): FieldPathValue<TFieldValues, TFieldName>;
export declare function useWatch<TFieldValues extends FieldValues = FieldValues, TFieldNames extends FieldPath<TFieldValues>[] = FieldPath<TFieldValues>[]>(props: {
    name: readonly [...TFieldNames];
    defaultValue?: UnpackNestedValue<DeepPartial<TFieldValues>>;
    control?: Control<TFieldValues>;
    disabled?: boolean;
}): FieldPathValues<TFieldValues, TFieldNames>;
