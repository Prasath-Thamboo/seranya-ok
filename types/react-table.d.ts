// types/react-table.d.ts
declare module 'react-table' {
    import { ReactNode } from 'react';
  
    export interface Column<T extends object = {}> {
      Header: string | ReactNode;
      accessor: keyof T | ((row: T) => any);
      Cell?: (props: { value: any; row: { original: T } }) => ReactNode;
    }
  
    export function useTable<T extends object = {}>(
      options: {
        columns: Column<T>[];
        data: T[];
        initialState?: Partial<{
          pageSize: number;
        }>;
      },
      ...plugins: any[]
    ): any;
  
    export function useGlobalFilter<T extends object = {}>(hooks: any): void;
    export function useSortBy<T extends object = {}>(hooks: any): void;
    export function usePagination<T extends object = {}>(hooks: any): void;
  }
  