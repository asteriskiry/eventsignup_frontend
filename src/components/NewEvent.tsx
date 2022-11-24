import {ChangeEvent, useState} from "react";
import {Form} from "react-router-dom";

export async function action() {
    await createContact();
}

export default function NewEvent() {
    const [name, setName] = useState("")
    const [place, setPlace] = useState("")
    const [price, setPrice] = useState("")
    const [startDate, setStartDate] = useState("") // Needs to be in ISO 8601 string in UTC before submitting
    const [endDate, setEndDate] = useState("") // Needs to be in ISO 8601 string in UTC before submitting
    const [description, setDescription] = useState("")
    const [signupStarts, setSignupStarts] = useState("") // Needs to be in ISO 8601 string in UTC before submitting
    const [signupEnd, setSignupEnds] = useState("") // Needs to be in ISO 8601 string in UTC before submitting
    const [bannerImg, setBannerImg] = useState("")
    const [minParticipants, setMinParticipants] = useState("")
    const [maxParticipants, setMaxParticipants] = useState("")
    const [quotas, setQuotas] = useState([])
    const [form, setForm] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [endDateVisible, setEndDateVisible] = useState(false)
    const [signupEndDateVisible, setSignupEndDateVisible] = useState(false)
    const [hasParticipantLimits, setHasParticipantLimits] = useState(false)
    const [hasQuotas, setHasQuotas] = useState(false)

    const classNameLoading = "control is-loading"
    const classNameNotLoading = "control"

    function handleQuotas(): void {

    }

    function prettyPrintQuotas(): string {
        let returnValue = ""
        if (quotas && quotas.length) {
            quotas.forEach(() => {

            })
        }
        return returnValue
    }

    return (
        <>
            <section className={"section"}>
                <p>
                    Pakolliset kentät on merkitty tähdellä (*).
                </p>
                <Form method={"post"}>
                    <div className={"field"}>
                        <label className={"label"}>Tapahtuman nimi*</label>
                        <div className={"control"}>
                            <input id={"name"} className={"input"} type={"text"} value={name} required={true}
                                   onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}/>
                        </div>
                    </div>
                    <div className={"field"}>
                        <label className={"label"}>Tapahtuman paikka*</label>
                        <div className={"control"}>
                            <input id={"place"} className={"input"} type={"text"} value={place} required={true}
                                   onChange={(e: ChangeEvent<HTMLInputElement>) => setPlace(e.target.value)}/>
                        </div>
                    </div>
                    <div className={"field"}>
                        <label className={"label"}>Tapahtuman kuvaus*</label>
                        <div className={"control"}>
                        <textarea id={"description"} className={"textarea"} value={description} required={true}
                                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}/>
                        </div>
                    </div>
                    <div className={"field"}>
                        <label className={"label"}>Tapahtuman hinta</label>
                        <div className={"control"}>
                            <input id={"price"} className={"input"} type={"number"} value={price} required={false}
                                   onChange={(e: ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)}/>
                        </div>
                    </div>
                    <label
                        className={"label"}>{endDateVisible ? "Tapahtuman aloituspäivä*" : "Tapahtuman ajankohta*"}</label>
                    <div className={"field is-grouped"}>
                        <div className={"control"}>
                            <input id={"startDate"} className={"input"} type={"datetime-local"} value={startDate}
                                   required={true}
                                   onChange={(e: ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)}/>
                        </div>
                        <div className={"control"}>
                            <label className="checkbox">
                                <input type="checkbox" className={"checkbox"}
                                       onChange={(event: ChangeEvent<HTMLInputElement>) => setEndDateVisible(event.target.checked)}/>
                                Tapahtumalla on myös lopetuspäivä
                            </label>
                        </div>
                    </div>
                    {endDateVisible &&
                        <div className={"field"}>
                            <label className={"label"}>Tapahtuman lopetuspäivä</label>
                            <div className={"control"}>
                                <input id={"endDate"} className={"input"} type={"datetime-local"} value={endDate}
                                       required={false}
                                       onChange={(e: ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)}/>
                            </div>
                        </div>
                    }
                    <label className={"label"}>Ilmoittautuminen alkaa*</label>
                    <div className={"field is-grouped"}>
                        <div className={"control"}>
                            <input id={"signupStarts"} className={"input"} type={"datetime-local"} value={signupStarts}
                                   required={true}
                                   onChange={(e: ChangeEvent<HTMLInputElement>) => setSignupStarts(e.target.value)}/>
                        </div>
                        <div className={"control"}>
                            <label className="checkbox">
                                <input type="checkbox" className={"checkbox"}
                                       onChange={(event: ChangeEvent<HTMLInputElement>) => setSignupEndDateVisible(event.target.checked)}/>
                                Tapahtumaan ilmoittautumisella on myös päättymispäivä
                            </label>
                        </div>
                    </div>
                    {signupEndDateVisible &&
                        <div className={"field"}>
                            <label className={"label"}>Ilmoittautuminen päättyy</label>
                            <div className={"control"}>
                                <input id={"signupEnds"} className={"input"} type={"datetime-local"} value={signupEnd}
                                       required={false}
                                       onChange={(e: ChangeEvent<HTMLInputElement>) => setSignupEnds(e.target.value)}/>
                            </div>
                        </div>
                    }
                    <label className={"label"}>Kuva</label>
                    <div className="file is-right is-fullwidth">
                        <label className="file-label">
                            <div className={isLoading ? classNameLoading : classNameNotLoading}>
                                <input id={"image"} className="file-input" type="image" name="Kuva"
                                       onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                           if (e.target.files !== null && e.target.files.length > 0) {
                                               setBannerImg(e.target.files[0].name)
                                               // TODO actually upload the file
                                               // Set return value to input "bannerImg"
                                           }
                                           setIsLoading(false)
                                       }} onClick={() => {
                                    setIsLoading(true)
                                }} alt={"Lisää kuva"}/>
                            </div>
                            <span className="file-cta">
                                  <span className="file-icon">
                                    <i className="fas fa-upload"></i>
                                  </span>
                                  <span className="file-label">Valitse kuva…</span>
                            </span>
                            <span className="file-name">{bannerImg}</span>
                        </label>
                    </div>
                    <div className={"field"}>
                        <div className={"control"}>
                            <input type={"hidden"} id={"bannerImg"}/>
                        </div>
                    </div>
                    {/*<label className={"label"}>Kuva</label>*/}
                    {/*<div className={"field is-grouped"}>*/}
                    {/*    <div className={"control"}>*/}
                    {/*        <input id={"bannerImg"} className={"input"} type={"text"} value={bannerImg} required={false}*/}
                    {/*               onChange={(e: ChangeEvent<HTMLInputElement>) => setBannerImg(e.target.value)}/>*/}
                    {/*    </div>*/}
                    {/*    <div className={"control"}>*/}
                    {/*        <button className={"button"}>Valitse tiedosto</button>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    <div className={"control"}>
                        <label className="checkbox">
                            <input type="checkbox" className={"checkbox"}
                                   onChange={(event: ChangeEvent<HTMLInputElement>) => setHasParticipantLimits(event.target.checked)}/>
                            Tapahtumalla on osallistujamäärä rajoituksia
                        </label>
                    </div>
                    {hasParticipantLimits && <>
                        <div className={"field"}>
                            <label className={"label"}>Minimi osallistujamäärä</label>
                            <div className={"control"}>
                                <input id={"minParticipants"} className={"input"} type={"number"}
                                       value={minParticipants}
                                       required={false}
                                       onChange={(e: ChangeEvent<HTMLInputElement>) => setMinParticipants(e.target.value)}/>
                            </div>
                        </div>
                        <div className={"field"}>
                            <label className={"label"}>Maksimi osallistujamäärä</label>
                            <div className={"control"}>
                                <input id={"maxParticipants"} className={"input"} type={"number"}
                                       value={maxParticipants}
                                       required={false}
                                       onChange={(e: ChangeEvent<HTMLInputElement>) => setMaxParticipants(e.target.value)}/>
                            </div>
                        </div>
                    </>
                    }
                    <div className={"control"}>
                        <label className="checkbox">
                            <input type="checkbox" className={"checkbox"}
                                   onChange={(event: ChangeEvent<HTMLInputElement>) => setHasQuotas(event.target.checked)}/>
                            Tapahtumalla on osallistujakiintijöitä
                        </label>
                    </div>
                    {hasQuotas && <>
                        <label className={"label"}>Osallistujakiintiöt</label>
                        <div className={"field is-grouped"}>
                            <div className={"control"}>
                                <input id={"quotas"} className={"input"} readOnly={true} type={"text"}
                                       value={prettyPrintQuotas()}
                                       required={false}/>
                                {/*  FIXME proper modal for input and input handling  */}
                            </div>
                            <button
                                className={"button"}>{(quotas && quotas.length) ? "Muokkaa kiintiöitä" : "Lisää kiintiöitä"}</button>
                        </div>
                    </>
                    }
                    <div className={"field is-grouped"}>
                        <button className="button is-link" type={"submit"}>Luo uusi tapahtuma</button>
                        <button className="button is-text" type={"reset"}>Tyhjennä</button>
                    </div>
                    <div>
                        {/* TODO form builder goes here */}
                    </div>
                </Form>
            </section>
        </>
    )
}
