import { useCallback } from 'react';
import { FetchResult } from '@apollo/client';

/**
 * Common error handling for GraphQL mutations
 */
export function handleMutationResult<T>(
  result: FetchResult<T>,
  dataField: keyof T
): T[keyof T] | undefined {
  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return result.data?.[dataField];
}

/**
 * Common error logging for mutations
 */
export function logMutationError(operationName: string, error: any): void {
  console.error(`Failed to ${operationName}:`, error);
}

/**
 * Creates a wrapped mutation function for create operations that handles errors and result extraction
 */
export function createCreateMutationWrapper<TData, TInput>(
  mutationFn: (options: {
    variables: { input: TInput };
  }) => Promise<FetchResult<TData>>,
  operationName: string,
  dataField: keyof TData
) {
  return useCallback(
    async (input: TInput) => {
      try {
        const result = await mutationFn({ variables: { input } });
        return handleMutationResult(result, dataField);
      } catch (err) {
        logMutationError(operationName, err);
        throw err;
      }
    },
    [mutationFn, operationName, dataField]
  );
}

/**
 * Creates a wrapped mutation function for update operations that handles errors and result extraction
 */
export function createUpdateMutationWrapper<TData, TInput>(
  mutationFn: (options: {
    variables: { id: string; input: TInput };
  }) => Promise<FetchResult<TData>>,
  operationName: string,
  dataField: keyof TData
) {
  return useCallback(
    async (id: string, input: TInput) => {
      try {
        const result = await mutationFn({ variables: { id, input } });
        return handleMutationResult(result, dataField);
      } catch (err) {
        logMutationError(operationName, err);
        throw err;
      }
    },
    [mutationFn, operationName, dataField]
  );
}

/**
 * Creates a wrapped mutation function for delete operations that handles errors and result extraction
 */
export function createDeleteMutationWrapper<TData>(
  mutationFn: (options: {
    variables: { id: string };
  }) => Promise<FetchResult<TData>>,
  operationName: string,
  dataField: keyof TData
) {
  return useCallback(
    async (id: string) => {
      try {
        const result = await mutationFn({ variables: { id } });
        return handleMutationResult(result, dataField);
      } catch (err) {
        logMutationError(operationName, err);
        throw err;
      }
    },
    [mutationFn, operationName, dataField]
  );
}
