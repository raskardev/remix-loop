import type { z } from "zod";

export type ActionState = {
  error?: string;
  success?: string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  [key: string]: any;
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type ValidatedActionFunction<S extends z.ZodType<any, any>, T> = (
  data: z.infer<S>,
  formData: FormData,
) => Promise<T>;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function validatedAction<S extends z.ZodType<any, any>, T>(
  schema: S,
  action: ValidatedActionFunction<S, T>,
) {
  return async (prevState: ActionState, formData: FormData): Promise<T> => {
    const data = Object.fromEntries(formData);
    const result = schema.safeParse(data);

    console.error(result.error?.errors);

    if (!result.success) {
      return { error: result.error?.errors[0].message, data } as T;
    }

    return action(result.data, formData);
  };
}
