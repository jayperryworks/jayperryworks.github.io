import { writable } from 'svelte/store'

// the total number of posts
export const total = writable(0)
// all the posts, broken down via pagination
// -> e.g. /writing/page/1
export const pages = writable([])
