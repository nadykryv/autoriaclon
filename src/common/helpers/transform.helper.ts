export class TransformHelper {
  public static toLowerCase({
    value,
  }: {
    value: string | null | undefined;
  }): string | null | undefined {
    return value ? value.toString().toLowerCase() : value;
  }

  public static trim({
    value,
  }: {
    value: string | null | undefined;
  }): string | null | undefined {
    return value ? value.toString().trim() : value;
  }

  public static trimArray({
    value,
  }: {
    value: string[] | null | undefined;
  }): string[] | null | undefined {
    return Array.isArray(value) ? value.map((item) => item.trim()) : value;
  }

  public static uniqueItems<T>({
    value,
  }: {
    value: T[] | null | undefined;
  }): T[] | null | undefined {
    return value ? Array.from(new Set(value)) : value;
  }

  public static toLowerCaseArray({
    value,
  }: {
    value: string[] | null | undefined;
  }): string[] | null | undefined {
    return Array.isArray(value)
      ? value.map((item) => item.toLowerCase())
      : value;
  }
}
