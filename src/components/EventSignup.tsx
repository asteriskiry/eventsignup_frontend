/*
Copyright Juhani Vähä-Mäkilä (juhani@fmail.co.uk) 2022.
Licenced under EUROPEAN UNION PUBLIC LICENCE v. 1.2.
 */
import {useEffect, useState} from "react";
import {Event} from "../types/Event";
import {EventComponent} from "./EventComponent"
import {get} from "./Utilities";

export default function EventSignup() {
    const [event, setEvent] = useState({} as Event)
    const [showEvent, setShowEvent] = useState(false)
    const [showError, setShowError] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

    function getEventIdFromPath(): string {
        const pathname = window.location.pathname
        const splitPath = pathname.split("/").filter(n => n)

        return splitPath[1]
    }

    useEffect(() => {
        const idFromPath = getEventIdFromPath()
        get(`/api/signup/${idFromPath}`)
            .then(async response => {
                if (response.ok) {
                    return Promise.all([await response.json(), await response.headers])
                } else {
                    const text = await response.text()
                    return Promise.reject(text)
                }
            })
            .then(([body, headers]) => {
                setEvent(body)
                setShowEvent(true)
                setShowError(false)
            })
            .catch(error => {
                setErrorMsg(error.message)
                setShowError(true)
            })
    }, [event])

    return (
        <>
            {showEvent &&
                <EventComponent event={event}/>
            }
            {showError &&
                <>

                    <section className={"section"}>
                        <h1 className={"title"}>Virhe!</h1>
                        <p>{errorMsg}</p>
                    </section>
                </>
            }
        </>
    )
}
