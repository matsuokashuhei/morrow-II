import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type CreateEventInput = {
  creatorId: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  emoji?: InputMaybe<Scalars['String']['input']>;
  endTime: Scalars['String']['input'];
  startTime: Scalars['String']['input'];
  title: Scalars['String']['input'];
  visibility?: InputMaybe<EventVisibility>;
};

export type CreateParticipantInput = {
  eventId: Scalars['ID']['input'];
  role?: InputMaybe<ParticipantRole>;
  status?: InputMaybe<ParticipantStatus>;
  userId: Scalars['ID']['input'];
};

export type CreateUserInput = {
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  cognitoId?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type Event = Node & {
  __typename?: 'Event';
  createdAt: Scalars['String']['output'];
  creator: User;
  description?: Maybe<Scalars['String']['output']>;
  emoji?: Maybe<Scalars['String']['output']>;
  endTime: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  participants: Array<Participant>;
  startTime: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  visibility: EventVisibility;
};

export enum EventVisibility {
  Private = 'private',
  Public = 'public',
  Shared = 'shared'
}

export type Mutation = {
  __typename?: 'Mutation';
  createEvent: Event;
  createParticipant: Participant;
  createUser: User;
  deleteEvent: Scalars['Boolean']['output'];
  deleteParticipant: Scalars['Boolean']['output'];
  deleteUser: Scalars['Boolean']['output'];
  updateEvent: Event;
  updateParticipant: Participant;
  updateUser: User;
};


export type MutationCreateEventArgs = {
  input: CreateEventInput;
};


export type MutationCreateParticipantArgs = {
  input: CreateParticipantInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeleteEventArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteParticipantArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateEventArgs = {
  id: Scalars['ID']['input'];
  input: UpdateEventInput;
};


export type MutationUpdateParticipantArgs = {
  id: Scalars['ID']['input'];
  input: UpdateParticipantInput;
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID']['input'];
  input: UpdateUserInput;
};

export type Node = {
  id: Scalars['ID']['output'];
};

export type Participant = Node & {
  __typename?: 'Participant';
  event: Event;
  id: Scalars['ID']['output'];
  joinedAt: Scalars['String']['output'];
  role: ParticipantRole;
  status: ParticipantStatus;
  updatedAt: Scalars['String']['output'];
  user: User;
};

export enum ParticipantRole {
  Owner = 'owner',
  Viewer = 'viewer'
}

export enum ParticipantStatus {
  Accepted = 'accepted',
  Declined = 'declined',
  Pending = 'pending'
}

export type Query = {
  __typename?: 'Query';
  event?: Maybe<Event>;
  events: Array<Event>;
  participant?: Maybe<Participant>;
  participants: Array<Participant>;
  user?: Maybe<User>;
  users: Array<User>;
};


export type QueryEventArgs = {
  id: Scalars['ID']['input'];
};


export type QueryParticipantArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type UpdateEventInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  emoji?: InputMaybe<Scalars['String']['input']>;
  endTime?: InputMaybe<Scalars['String']['input']>;
  startTime?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  visibility?: InputMaybe<EventVisibility>;
};

export type UpdateParticipantInput = {
  role?: InputMaybe<ParticipantRole>;
  status?: InputMaybe<ParticipantStatus>;
};

export type UpdateUserInput = {
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  cognitoId?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type User = Node & {
  __typename?: 'User';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  cognitoId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  createdEvents: Array<Event>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  participants: Array<Participant>;
  updatedAt: Scalars['String']['output'];
};

export type GetEventsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEventsQuery = { __typename?: 'Query', events: Array<{ __typename?: 'Event', id: string, title: string, description?: string | null, startTime: string, endTime: string, emoji?: string | null, visibility: EventVisibility, createdAt: string, updatedAt: string, creator: { __typename?: 'User', id: string, name: string, email: string }, participants: Array<{ __typename?: 'Participant', id: string, role: ParticipantRole, status: ParticipantStatus, user: { __typename?: 'User', id: string, name: string, email: string } }> }> };

export type GetEventQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetEventQuery = { __typename?: 'Query', event?: { __typename?: 'Event', id: string, title: string, description?: string | null, startTime: string, endTime: string, emoji?: string | null, visibility: EventVisibility, createdAt: string, updatedAt: string, creator: { __typename?: 'User', id: string, name: string, email: string, avatarUrl?: string | null }, participants: Array<{ __typename?: 'Participant', id: string, role: ParticipantRole, status: ParticipantStatus, joinedAt: string, user: { __typename?: 'User', id: string, name: string, email: string, avatarUrl?: string | null } }> } | null };

export type CreateEventMutationVariables = Exact<{
  input: CreateEventInput;
}>;


export type CreateEventMutation = { __typename?: 'Mutation', createEvent: { __typename?: 'Event', id: string, title: string, description?: string | null, startTime: string, endTime: string, emoji?: string | null, visibility: EventVisibility, createdAt: string, updatedAt: string, creator: { __typename?: 'User', id: string, name: string, email: string } } };

export type UpdateEventMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateEventInput;
}>;


export type UpdateEventMutation = { __typename?: 'Mutation', updateEvent: { __typename?: 'Event', id: string, title: string, description?: string | null, startTime: string, endTime: string, emoji?: string | null, visibility: EventVisibility, createdAt: string, updatedAt: string, creator: { __typename?: 'User', id: string, name: string, email: string } } };

export type DeleteEventMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteEventMutation = { __typename?: 'Mutation', deleteEvent: boolean };

export type GetParticipantsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetParticipantsQuery = { __typename?: 'Query', participants: Array<{ __typename?: 'Participant', id: string, role: ParticipantRole, status: ParticipantStatus, joinedAt: string, updatedAt: string, user: { __typename?: 'User', id: string, name: string, email: string, avatarUrl?: string | null }, event: { __typename?: 'Event', id: string, title: string, startTime: string, endTime: string, emoji?: string | null } }> };

export type GetParticipantQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetParticipantQuery = { __typename?: 'Query', participant?: { __typename?: 'Participant', id: string, role: ParticipantRole, status: ParticipantStatus, joinedAt: string, updatedAt: string, user: { __typename?: 'User', id: string, name: string, email: string, avatarUrl?: string | null }, event: { __typename?: 'Event', id: string, title: string, description?: string | null, startTime: string, endTime: string, emoji?: string | null, visibility: EventVisibility, creator: { __typename?: 'User', id: string, name: string, email: string } } } | null };

export type CreateParticipantMutationVariables = Exact<{
  input: CreateParticipantInput;
}>;


export type CreateParticipantMutation = { __typename?: 'Mutation', createParticipant: { __typename?: 'Participant', id: string, role: ParticipantRole, status: ParticipantStatus, joinedAt: string, updatedAt: string, user: { __typename?: 'User', id: string, name: string, email: string }, event: { __typename?: 'Event', id: string, title: string, startTime: string, endTime: string } } };

export type UpdateParticipantMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateParticipantInput;
}>;


export type UpdateParticipantMutation = { __typename?: 'Mutation', updateParticipant: { __typename?: 'Participant', id: string, role: ParticipantRole, status: ParticipantStatus, joinedAt: string, updatedAt: string, user: { __typename?: 'User', id: string, name: string, email: string }, event: { __typename?: 'Event', id: string, title: string, startTime: string, endTime: string } } };

export type DeleteParticipantMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteParticipantMutation = { __typename?: 'Mutation', deleteParticipant: boolean };

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, email: string, name: string, avatarUrl?: string | null, cognitoId?: string | null, createdAt: string, updatedAt: string }> };

export type GetUserQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetUserQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: string, email: string, name: string, avatarUrl?: string | null, cognitoId?: string | null, createdAt: string, updatedAt: string, createdEvents: Array<{ __typename?: 'Event', id: string, title: string, description?: string | null, startTime: string, endTime: string, emoji?: string | null, visibility: EventVisibility }>, participants: Array<{ __typename?: 'Participant', id: string, role: ParticipantRole, status: ParticipantStatus, joinedAt: string, event: { __typename?: 'Event', id: string, title: string, startTime: string, endTime: string } }> } | null };

export type CreateUserMutationVariables = Exact<{
  input: CreateUserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'User', id: string, email: string, name: string, avatarUrl?: string | null, cognitoId?: string | null, createdAt: string, updatedAt: string } };

export type UpdateUserMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', id: string, email: string, name: string, avatarUrl?: string | null, cognitoId?: string | null, createdAt: string, updatedAt: string } };

export type DeleteUserMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser: boolean };


export const GetEventsDocument = gql`
    query GetEvents {
  events {
    id
    title
    description
    startTime
    endTime
    emoji
    visibility
    createdAt
    updatedAt
    creator {
      id
      name
      email
    }
    participants {
      id
      role
      status
      user {
        id
        name
        email
      }
    }
  }
}
    `;

/**
 * __useGetEventsQuery__
 *
 * To run a query within a React component, call `useGetEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEventsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetEventsQuery(baseOptions?: Apollo.QueryHookOptions<GetEventsQuery, GetEventsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetEventsQuery, GetEventsQueryVariables>(GetEventsDocument, options);
      }
export function useGetEventsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetEventsQuery, GetEventsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetEventsQuery, GetEventsQueryVariables>(GetEventsDocument, options);
        }
export function useGetEventsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetEventsQuery, GetEventsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetEventsQuery, GetEventsQueryVariables>(GetEventsDocument, options);
        }
export type GetEventsQueryHookResult = ReturnType<typeof useGetEventsQuery>;
export type GetEventsLazyQueryHookResult = ReturnType<typeof useGetEventsLazyQuery>;
export type GetEventsSuspenseQueryHookResult = ReturnType<typeof useGetEventsSuspenseQuery>;
export type GetEventsQueryResult = Apollo.QueryResult<GetEventsQuery, GetEventsQueryVariables>;
export const GetEventDocument = gql`
    query GetEvent($id: ID!) {
  event(id: $id) {
    id
    title
    description
    startTime
    endTime
    emoji
    visibility
    createdAt
    updatedAt
    creator {
      id
      name
      email
      avatarUrl
    }
    participants {
      id
      role
      status
      joinedAt
      user {
        id
        name
        email
        avatarUrl
      }
    }
  }
}
    `;

/**
 * __useGetEventQuery__
 *
 * To run a query within a React component, call `useGetEventQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEventQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEventQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetEventQuery(baseOptions: Apollo.QueryHookOptions<GetEventQuery, GetEventQueryVariables> & ({ variables: GetEventQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetEventQuery, GetEventQueryVariables>(GetEventDocument, options);
      }
export function useGetEventLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetEventQuery, GetEventQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetEventQuery, GetEventQueryVariables>(GetEventDocument, options);
        }
export function useGetEventSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetEventQuery, GetEventQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetEventQuery, GetEventQueryVariables>(GetEventDocument, options);
        }
export type GetEventQueryHookResult = ReturnType<typeof useGetEventQuery>;
export type GetEventLazyQueryHookResult = ReturnType<typeof useGetEventLazyQuery>;
export type GetEventSuspenseQueryHookResult = ReturnType<typeof useGetEventSuspenseQuery>;
export type GetEventQueryResult = Apollo.QueryResult<GetEventQuery, GetEventQueryVariables>;
export const CreateEventDocument = gql`
    mutation CreateEvent($input: CreateEventInput!) {
  createEvent(input: $input) {
    id
    title
    description
    startTime
    endTime
    emoji
    visibility
    createdAt
    updatedAt
    creator {
      id
      name
      email
    }
  }
}
    `;
export type CreateEventMutationFn = Apollo.MutationFunction<CreateEventMutation, CreateEventMutationVariables>;

/**
 * __useCreateEventMutation__
 *
 * To run a mutation, you first call `useCreateEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEventMutation, { data, loading, error }] = useCreateEventMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateEventMutation(baseOptions?: Apollo.MutationHookOptions<CreateEventMutation, CreateEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateEventMutation, CreateEventMutationVariables>(CreateEventDocument, options);
      }
export type CreateEventMutationHookResult = ReturnType<typeof useCreateEventMutation>;
export type CreateEventMutationResult = Apollo.MutationResult<CreateEventMutation>;
export type CreateEventMutationOptions = Apollo.BaseMutationOptions<CreateEventMutation, CreateEventMutationVariables>;
export const UpdateEventDocument = gql`
    mutation UpdateEvent($id: ID!, $input: UpdateEventInput!) {
  updateEvent(id: $id, input: $input) {
    id
    title
    description
    startTime
    endTime
    emoji
    visibility
    createdAt
    updatedAt
    creator {
      id
      name
      email
    }
  }
}
    `;
export type UpdateEventMutationFn = Apollo.MutationFunction<UpdateEventMutation, UpdateEventMutationVariables>;

/**
 * __useUpdateEventMutation__
 *
 * To run a mutation, you first call `useUpdateEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateEventMutation, { data, loading, error }] = useUpdateEventMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateEventMutation(baseOptions?: Apollo.MutationHookOptions<UpdateEventMutation, UpdateEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateEventMutation, UpdateEventMutationVariables>(UpdateEventDocument, options);
      }
export type UpdateEventMutationHookResult = ReturnType<typeof useUpdateEventMutation>;
export type UpdateEventMutationResult = Apollo.MutationResult<UpdateEventMutation>;
export type UpdateEventMutationOptions = Apollo.BaseMutationOptions<UpdateEventMutation, UpdateEventMutationVariables>;
export const DeleteEventDocument = gql`
    mutation DeleteEvent($id: ID!) {
  deleteEvent(id: $id)
}
    `;
export type DeleteEventMutationFn = Apollo.MutationFunction<DeleteEventMutation, DeleteEventMutationVariables>;

/**
 * __useDeleteEventMutation__
 *
 * To run a mutation, you first call `useDeleteEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteEventMutation, { data, loading, error }] = useDeleteEventMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteEventMutation(baseOptions?: Apollo.MutationHookOptions<DeleteEventMutation, DeleteEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteEventMutation, DeleteEventMutationVariables>(DeleteEventDocument, options);
      }
export type DeleteEventMutationHookResult = ReturnType<typeof useDeleteEventMutation>;
export type DeleteEventMutationResult = Apollo.MutationResult<DeleteEventMutation>;
export type DeleteEventMutationOptions = Apollo.BaseMutationOptions<DeleteEventMutation, DeleteEventMutationVariables>;
export const GetParticipantsDocument = gql`
    query GetParticipants {
  participants {
    id
    role
    status
    joinedAt
    updatedAt
    user {
      id
      name
      email
      avatarUrl
    }
    event {
      id
      title
      startTime
      endTime
      emoji
    }
  }
}
    `;

/**
 * __useGetParticipantsQuery__
 *
 * To run a query within a React component, call `useGetParticipantsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetParticipantsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetParticipantsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetParticipantsQuery(baseOptions?: Apollo.QueryHookOptions<GetParticipantsQuery, GetParticipantsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetParticipantsQuery, GetParticipantsQueryVariables>(GetParticipantsDocument, options);
      }
export function useGetParticipantsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetParticipantsQuery, GetParticipantsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetParticipantsQuery, GetParticipantsQueryVariables>(GetParticipantsDocument, options);
        }
export function useGetParticipantsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetParticipantsQuery, GetParticipantsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetParticipantsQuery, GetParticipantsQueryVariables>(GetParticipantsDocument, options);
        }
export type GetParticipantsQueryHookResult = ReturnType<typeof useGetParticipantsQuery>;
export type GetParticipantsLazyQueryHookResult = ReturnType<typeof useGetParticipantsLazyQuery>;
export type GetParticipantsSuspenseQueryHookResult = ReturnType<typeof useGetParticipantsSuspenseQuery>;
export type GetParticipantsQueryResult = Apollo.QueryResult<GetParticipantsQuery, GetParticipantsQueryVariables>;
export const GetParticipantDocument = gql`
    query GetParticipant($id: ID!) {
  participant(id: $id) {
    id
    role
    status
    joinedAt
    updatedAt
    user {
      id
      name
      email
      avatarUrl
    }
    event {
      id
      title
      description
      startTime
      endTime
      emoji
      visibility
      creator {
        id
        name
        email
      }
    }
  }
}
    `;

/**
 * __useGetParticipantQuery__
 *
 * To run a query within a React component, call `useGetParticipantQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetParticipantQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetParticipantQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetParticipantQuery(baseOptions: Apollo.QueryHookOptions<GetParticipantQuery, GetParticipantQueryVariables> & ({ variables: GetParticipantQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetParticipantQuery, GetParticipantQueryVariables>(GetParticipantDocument, options);
      }
export function useGetParticipantLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetParticipantQuery, GetParticipantQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetParticipantQuery, GetParticipantQueryVariables>(GetParticipantDocument, options);
        }
export function useGetParticipantSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetParticipantQuery, GetParticipantQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetParticipantQuery, GetParticipantQueryVariables>(GetParticipantDocument, options);
        }
export type GetParticipantQueryHookResult = ReturnType<typeof useGetParticipantQuery>;
export type GetParticipantLazyQueryHookResult = ReturnType<typeof useGetParticipantLazyQuery>;
export type GetParticipantSuspenseQueryHookResult = ReturnType<typeof useGetParticipantSuspenseQuery>;
export type GetParticipantQueryResult = Apollo.QueryResult<GetParticipantQuery, GetParticipantQueryVariables>;
export const CreateParticipantDocument = gql`
    mutation CreateParticipant($input: CreateParticipantInput!) {
  createParticipant(input: $input) {
    id
    role
    status
    joinedAt
    updatedAt
    user {
      id
      name
      email
    }
    event {
      id
      title
      startTime
      endTime
    }
  }
}
    `;
export type CreateParticipantMutationFn = Apollo.MutationFunction<CreateParticipantMutation, CreateParticipantMutationVariables>;

/**
 * __useCreateParticipantMutation__
 *
 * To run a mutation, you first call `useCreateParticipantMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateParticipantMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createParticipantMutation, { data, loading, error }] = useCreateParticipantMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateParticipantMutation(baseOptions?: Apollo.MutationHookOptions<CreateParticipantMutation, CreateParticipantMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateParticipantMutation, CreateParticipantMutationVariables>(CreateParticipantDocument, options);
      }
export type CreateParticipantMutationHookResult = ReturnType<typeof useCreateParticipantMutation>;
export type CreateParticipantMutationResult = Apollo.MutationResult<CreateParticipantMutation>;
export type CreateParticipantMutationOptions = Apollo.BaseMutationOptions<CreateParticipantMutation, CreateParticipantMutationVariables>;
export const UpdateParticipantDocument = gql`
    mutation UpdateParticipant($id: ID!, $input: UpdateParticipantInput!) {
  updateParticipant(id: $id, input: $input) {
    id
    role
    status
    joinedAt
    updatedAt
    user {
      id
      name
      email
    }
    event {
      id
      title
      startTime
      endTime
    }
  }
}
    `;
export type UpdateParticipantMutationFn = Apollo.MutationFunction<UpdateParticipantMutation, UpdateParticipantMutationVariables>;

/**
 * __useUpdateParticipantMutation__
 *
 * To run a mutation, you first call `useUpdateParticipantMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateParticipantMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateParticipantMutation, { data, loading, error }] = useUpdateParticipantMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateParticipantMutation(baseOptions?: Apollo.MutationHookOptions<UpdateParticipantMutation, UpdateParticipantMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateParticipantMutation, UpdateParticipantMutationVariables>(UpdateParticipantDocument, options);
      }
export type UpdateParticipantMutationHookResult = ReturnType<typeof useUpdateParticipantMutation>;
export type UpdateParticipantMutationResult = Apollo.MutationResult<UpdateParticipantMutation>;
export type UpdateParticipantMutationOptions = Apollo.BaseMutationOptions<UpdateParticipantMutation, UpdateParticipantMutationVariables>;
export const DeleteParticipantDocument = gql`
    mutation DeleteParticipant($id: ID!) {
  deleteParticipant(id: $id)
}
    `;
export type DeleteParticipantMutationFn = Apollo.MutationFunction<DeleteParticipantMutation, DeleteParticipantMutationVariables>;

/**
 * __useDeleteParticipantMutation__
 *
 * To run a mutation, you first call `useDeleteParticipantMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteParticipantMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteParticipantMutation, { data, loading, error }] = useDeleteParticipantMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteParticipantMutation(baseOptions?: Apollo.MutationHookOptions<DeleteParticipantMutation, DeleteParticipantMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteParticipantMutation, DeleteParticipantMutationVariables>(DeleteParticipantDocument, options);
      }
export type DeleteParticipantMutationHookResult = ReturnType<typeof useDeleteParticipantMutation>;
export type DeleteParticipantMutationResult = Apollo.MutationResult<DeleteParticipantMutation>;
export type DeleteParticipantMutationOptions = Apollo.BaseMutationOptions<DeleteParticipantMutation, DeleteParticipantMutationVariables>;
export const GetUsersDocument = gql`
    query GetUsers {
  users {
    id
    email
    name
    avatarUrl
    cognitoId
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetUsersQuery__
 *
 * To run a query within a React component, call `useGetUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUsersQuery(baseOptions?: Apollo.QueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
      }
export function useGetUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
        }
export function useGetUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
        }
export type GetUsersQueryHookResult = ReturnType<typeof useGetUsersQuery>;
export type GetUsersLazyQueryHookResult = ReturnType<typeof useGetUsersLazyQuery>;
export type GetUsersSuspenseQueryHookResult = ReturnType<typeof useGetUsersSuspenseQuery>;
export type GetUsersQueryResult = Apollo.QueryResult<GetUsersQuery, GetUsersQueryVariables>;
export const GetUserDocument = gql`
    query GetUser($id: ID!) {
  user(id: $id) {
    id
    email
    name
    avatarUrl
    cognitoId
    createdAt
    updatedAt
    createdEvents {
      id
      title
      description
      startTime
      endTime
      emoji
      visibility
    }
    participants {
      id
      role
      status
      joinedAt
      event {
        id
        title
        startTime
        endTime
      }
    }
  }
}
    `;

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetUserQuery(baseOptions: Apollo.QueryHookOptions<GetUserQuery, GetUserQueryVariables> & ({ variables: GetUserQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
      }
export function useGetUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
export function useGetUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserSuspenseQueryHookResult = ReturnType<typeof useGetUserSuspenseQuery>;
export type GetUserQueryResult = Apollo.QueryResult<GetUserQuery, GetUserQueryVariables>;
export const CreateUserDocument = gql`
    mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    email
    name
    avatarUrl
    cognitoId
    createdAt
    updatedAt
  }
}
    `;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const UpdateUserDocument = gql`
    mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
  updateUser(id: $id, input: $input) {
    id
    email
    name
    avatarUrl
    cognitoId
    createdAt
    updatedAt
  }
}
    `;
export type UpdateUserMutationFn = Apollo.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, options);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
export const DeleteUserDocument = gql`
    mutation DeleteUser($id: ID!) {
  deleteUser(id: $id)
}
    `;
export type DeleteUserMutationFn = Apollo.MutationFunction<DeleteUserMutation, DeleteUserMutationVariables>;

/**
 * __useDeleteUserMutation__
 *
 * To run a mutation, you first call `useDeleteUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserMutation, { data, loading, error }] = useDeleteUserMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteUserMutation(baseOptions?: Apollo.MutationHookOptions<DeleteUserMutation, DeleteUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument, options);
      }
export type DeleteUserMutationHookResult = ReturnType<typeof useDeleteUserMutation>;
export type DeleteUserMutationResult = Apollo.MutationResult<DeleteUserMutation>;
export type DeleteUserMutationOptions = Apollo.BaseMutationOptions<DeleteUserMutation, DeleteUserMutationVariables>;