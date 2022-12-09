/*
Copyright Juhani Vähä-Mäkilä (juhani@fmail.co.uk) 2022.
Licenced under EUROPEAN UNION PUBLIC LICENCE v. 1.2.
 */
// Corresponds to its counterpart in the backend.
export type Event = {
    name: string
    place: string
    description: string
    price?: number
    startDate: string //ISO 8601 string in UTC
    endDate?: string // ISO 8601 string in UTC
    signupStarts: string // ISO 8601 string in UTC
    signupEnds?: string // ISO 8601 string in UTC
    bannerImg?: string
    minParticipants?: number
    maxParticipants?: number
    quotas?: {}
    form?: {}
}
