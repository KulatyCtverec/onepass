export interface Setter<T> {
  (value: T): void;
}

export interface StateWithSetter<T> {
  value: T;
  setter: React.Dispatch<React.SetStateAction<T>>;
}

export interface SSEMessage<T> {
  type: "create" | "update" | "delete";
  data: T;
}

