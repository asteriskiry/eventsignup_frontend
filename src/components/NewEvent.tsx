/*
Copyright Juhani Vähä-Mäkilä (juhani@fmail.co.uk) 2022.
Licenced under EUROPEAN UNION PUBLIC LICENCE v. 1.2.
 */
import {ChangeEvent, useState} from "react";
import {Event} from "../types/Event";


// @ts-ignore
export async function action({request}) {
    const formData = await request.formData()
    const updates = Object.fromEntries(formData)
    const event: Event = {
        description: updates.description,
        place: updates.place,
        signupStarts: convertLocalDateToUTCISOString(updates.signupStarts),
        startDate: convertLocalDateToUTCISOString(updates.startDate),
        name: updates.name
    }
    if (Object.hasOwn(updates, "bannerImg")) {
        event.bannerImg = updates.bannerImg
    }
    if (Object.hasOwn(updates, "endDate")) {
        event.endDate = convertLocalDateToUTCISOString(updates.endDate)
    }
    if (Object.hasOwn(updates, "maxParticipants")) {
        event.maxParticipants = updates.maxParticipants
    }
    if (Object.hasOwn(updates, "minParticipants")) {
        event.minParticipants = updates.minParticipants
    }
    if (Object.hasOwn(updates, "price")) {
        event.price = updates.price
    }
    if (Object.hasOwn(updates, "quotas")) {
        event.quotas = updates.quotas
    }
    if (Object.hasOwn(updates, "signupEnds")) {
        event.signupEnds = convertLocalDateToUTCISOString(updates.signupEnds)
    }

    // TODO upload data to backend
    // await updateContact(params.contactId, updates);
    // return redirect(`/contacts/${params.contactId}`);
    // await createContact();
}

// Source: https://stackoverflow.com/a/6777470
function convertLocalDateToUTCISOString(inputDate: string | number | Date): string {
    const date = new Date(inputDate)
    const inputInUTC = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
        date.getUTCDate(), date.getUTCHours(),
        date.getUTCMinutes(), date.getUTCSeconds())
    return new Date(inputInUTC).toISOString()
}

export default function NewEvent() {
    const [name, setName] = useState("")
    const [place, setPlace] = useState("")
    const [price, setPrice] = useState("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [description, setDescription] = useState("")
    const [signupStarts, setSignupStarts] = useState("")
    const [signupEnd, setSignupEnds] = useState("")
    const [bannerImg, setBannerImg] = useState("")
    const [minParticipants, setMinParticipants] = useState("")
    const [maxParticipants, setMaxParticipants] = useState("")
    const [quotas, setQuotas] = useState(new Map<string, string>)
    // const [form, setForm] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [endDateVisible, setEndDateVisible] = useState(false)
    const [signupEndDateVisible, setSignupEndDateVisible] = useState(false)
    const [hasParticipantLimits, setHasParticipantLimits] = useState(false)
    const [hasQuotas, setHasQuotas] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false)

    const classNameLoading = "control is-loading"
    const classNameNotLoading = "control"
    const classNameModalActive = "modal is-active"
    const classNameModalNonActive = "modal"

    function handleQuotas(): void {

    }

    function prettyPrintQuotas(): string {
        let returnValue = ""
        if (quotas && quotas.size) {

        }
        return returnValue
    }

    function showModal(): void {
        setIsModalVisible(true)
    }

    function handleForm() {

    }

    function hideModal(): void {
        setIsModalVisible(false)
    }

    function saveQuotas(): void {

    }

    return (
        <>
            <section className={"section"}>
                <p>
                    Pakolliset kentät on merkitty tähdellä (*).
                </p>
                <form onSubmit={handleForm}>
                    <div className={"field"}>
                        <label className={"label"}>Tapahtuman nimi*</label>
                        <div className={"control"}>
                            <input id={"name"} name={"name"} className={"input"} type={"text"} value={name}
                                   required={true}
                                   onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}/>
                        </div>
                    </div>
                    <div className={"field"}>
                        <label className={"label"}>Tapahtuman paikka*</label>
                        <div className={"control"}>
                            <input id={"place"} name={"place"} className={"input"} type={"text"} value={place}
                                   required={true}
                                   onChange={(e: ChangeEvent<HTMLInputElement>) => setPlace(e.target.value)}/>
                        </div>
                    </div>
                    <div className={"field"}>
                        <label className={"label"}>Tapahtuman kuvaus*</label>
                        <div className={"control"}>
                        <textarea id={"description"} name={"description"} className={"textarea"} value={description}
                                  required={true}
                                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}/>
                        </div>
                    </div>
                    <div className={"field"}>
                        <label className={"label"}>Tapahtuman hinta</label>
                        <div className={"control"}>
                            <input id={"price"} name={"price"} className={"input"} type={"number"} value={price}
                                   required={false}
                                   onChange={(e: ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)}/>
                        </div>
                    </div>
                    <label
                        className={"label"}>{endDateVisible ? "Tapahtuman aloituspäivä*" : "Tapahtuman ajankohta*"}</label>
                    <div className={"field is-grouped"}>
                        <div className={"control"}>
                            <input id={"startDate"} name={"startDate"} className={"input"} type={"datetime-local"}
                                   value={startDate}
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
                                <input id={"endDate"} name={"endDate"} className={"input"} type={"datetime-local"}
                                       value={endDate}
                                       required={false}
                                       onChange={(e: ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)}/>
                            </div>
                        </div>
                    }
                    <label className={"label"}>Ilmoittautuminen alkaa*</label>
                    <div className={"field is-grouped"}>
                        <div className={"control"}>
                            <input id={"signupStarts"} name={"signupStarts"} className={"input"} type={"datetime-local"}
                                   value={signupStarts}
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
                                <input id={"signupEnds"} name={"signupEnds"} className={"input"} type={"datetime-local"}
                                       value={signupEnd}
                                       required={false}
                                       onChange={(e: ChangeEvent<HTMLInputElement>) => setSignupEnds(e.target.value)}/>
                            </div>
                        </div>
                    }
                    <label className={"label"}>Kuva</label>
                    <div className="file is-right is-fullwidth">
                        <label className="file-label">
                            <div className={isLoading ? classNameLoading : classNameNotLoading}>
                                <input id={"image"} className="file-input" type="image" name="image"
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
                            <input type={"hidden"} id={"bannerImg"} name={"bannerImg"}/>
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
                                <input id={"minParticipants"} name={"minParticipants"} className={"input"}
                                       type={"number"}
                                       value={minParticipants}
                                       required={false}
                                       onChange={(e: ChangeEvent<HTMLInputElement>) => setMinParticipants(e.target.value)}/>
                            </div>
                        </div>
                        <div className={"field"}>
                            <label className={"label"}>Maksimi osallistujamäärä</label>
                            <div className={"control"}>
                                <input id={"maxParticipants"} name={"maxParticipants"} className={"input"}
                                       type={"number"}
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
                                <textarea id={"quotas"} name={"quotas"} className={"textarea"} readOnly={true}
                                          value={prettyPrintQuotas()}
                                          required={false} disabled={true}/>
                                {/*  FIXME proper modal for input and input handling  */}
                            </div>
                            <button
                                className={"button"}
                                onClick={showModal}>{(quotas && quotas.size) ? "Muokkaa kiintiöitä" : "Lisää kiintiöitä"}</button>
                        </div>
                    </>
                    }
                    <div className={"field is-grouped"}>
                        <button className="button is-link" type={"submit"}>Luo uusi tapahtuma</button>
                        <button className="button is-text" type={"reset"}>Tyhjennä</button>
                    </div>
                </form>
            </section>
            {isModalVisible &&
                <div className={isModalVisible ? classNameModalActive : classNameModalNonActive}>
                    <div className="modal-background"></div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">Osallistumiskiintiöt</p>
                            <button className="delete" aria-label="close" onClick={hideModal}></button>
                        </header>
                        <section className="modal-card-body">
                            <div className={"field is-grouped"}>
                                {/*FIXME ei toimi kunnolla*/}
                                <label className={"label"}>Käyttäjäryhmä</label>
                                <label className={"label"}>Kiintiö</label>
                                <button className={"button"}>Lisää</button>
                            </div>
                            {(quotas && quotas.size) ? Array.from(quotas.keys()).map(key => (
                                    <>
                                        <div className={"field is-grouped"}>
                                            <input type={"text"} name={key} defaultValue={key}/>
                                            <input type={"text"} name={quotas.get(key)} defaultValue={quotas.get(key)}/>
                                            {/*<button className={"button"}></button>*/}
                                            <i className="fas fa-pencil-alt"></i>
                                        </div>
                                    </>
                                )
                            ) : (
                                <>
                                    <div className={"field is-grouped"}>
                                        <input type={"text"} name={"emptyGroup"}/>
                                        <input type={"text"} name={"emptyQuota"}/>
                                        {/*<button className={"button"}></button>*/}
                                        <i className="fas fa-pencil-alt"></i>
                                    </div>
                                </>
                            )
                            }
                            {/*<div className={"table-container"}>*/}
                            {/*    <table className={"table is-striped is-hoverable"}>*/}
                            {/*        <thead>*/}
                            {/*        <tr>*/}
                            {/*            <th>Käyttäjäryhmä</th>*/}
                            {/*            <th>Kiintiö</th>*/}
                            {/*            <th></th>*/}
                            {/*        </tr>*/}
                            {/*        </thead>*/}
                            {/*        <tbody>*/}
                            {/*        {(quotas && quotas.size) ? (*/}
                            {/*                <tr>*/}
                            {/*                    {Array.from(quotas.keys()).map(key => (*/}
                            {/*                        <>*/}
                            {/*                            <td>*/}
                            {/*                                {key}*/}
                            {/*                            </td>*/}
                            {/*                            <td>*/}
                            {/*                                {quotas.get(key)}*/}
                            {/*                            </td>*/}
                            {/*                            <td>add button goes here</td>*/}
                            {/*                        </>*/}
                            {/*                    ))*/}
                            {/*                    }*/}
                            {/*                </tr>*/}
                            {/*            ) :*/}
                            {/*            <tr>*/}
                            {/*                <td></td>*/}
                            {/*                <td></td>*/}
                            {/*                <td>add button goes here</td>*/}
                            {/*            </tr>*/}
                            {/*        }*/}
                            {/*        </tbody>*/}
                            {/*    </table>*/}
                            {/*</div>*/}
                            {/*<div className={"field is-grouped"}>*/}
                            {/*    <div className="select">*/}
                            {/*        /!*<label className={"label"}>Käyttäjäryhmä</label>*!/*/}
                            {/*        <select>*/}
                            {/*            <option>Select dropdown</option>*/}
                            {/*            <option>With options</option>*/}
                            {/*        </select>*/}
                            {/*    </div>*/}
                            {/*    /!*<label className={"label"}>Kiintiö</label>*!/*/}
                            {/*    <div className="input">*/}
                            {/*        /!* FIXME set the value correctly. From event in select? *!/*/}
                            {/*        <input type={"text"} value={""}/>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                            {/*<div className={"field"}>*/}
                            {/*    <textarea className={"textarea"}>{prettyPrintQuotas()}</textarea>*/}
                            {/*</div>*/}
                        </section>
                        <footer className="modal-card-foot">
                            <button className="button is-success" onClick={saveQuotas}>Tallenna</button>
                            <button className="button is-text" onClick={hideModal}>Peruuta</button>
                        </footer>
                    </div>
                </div>
            }
        </>
    )
}
