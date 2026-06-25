import type { TaskFilters } from '@/types'

export const thoughtKeys = {
  all: ['thoughts'] as const,
  inbox: () => ['thoughts', 'inbox'] as const,
  archived: () => ['thoughts', 'archived'] as const,
}

export const taskKeys = {
  all: ['tasks'] as const,
  filtered: (filters: TaskFilters) => ['tasks', 'filtered', filters] as const,
  detail: (id: string) => ['tasks', id] as const,
  overdue: () => ['tasks', 'overdue'] as const,
}

export const eventKeys = {
  all: ['events'] as const,
  range: (start: string, end: string) => ['events', 'range', start, end] as const,
  upcoming: () => ['events', 'upcoming'] as const,
  detail: (id: string) => ['events', id] as const,
}

export const birthdayKeys = {
  all: ['birthdays'] as const,
}

export const folderKeys = {
  all: ['folders'] as const,
  children: (parentId: string | null) => ['folders', 'children', parentId] as const,
}

export const noteKeys = {
  all: ['notes'] as const,
  inFolder: (folderId: string | null, tags?: string[]) => ['notes', 'folder', folderId, tags] as const,
  recent: () => ['notes', 'recent'] as const,
  search: (query: string) => ['notes', 'search', query] as const,
}

export const fileKeys = {
  all: ['files'] as const,
  inFolder: (folderId: string | null, tags?: string[]) => ['files', 'folder', folderId, tags] as const,
  search: (query: string) => ['files', 'search', query] as const,
}

export const profileKeys = {
  me: ['profile', 'me'] as const,
}
