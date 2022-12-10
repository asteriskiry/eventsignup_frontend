/*
Copyright Juhani Vähä-Mäkilä (juhani@fmail.co.uk) 2022.
Licenced under EUROPEAN UNION PUBLIC LICENCE v. 1.2.
 */
import {ChangeEvent, Component} from "react";
import {Event} from "../types/Event";
import {ReactFormBuilder, ReactFormGenerator} from 'react-form-builder2';
import 'react-form-builder2/dist/app.css';
import ClipLoader from "react-spinners/ClipLoader";
import {postEvent, postImageData} from "./Utilities";


interface NewEventProps {
}

interface NewEventState {
    // Form fields
    name: string
    place: string
    startDate: string
    endDate?: string
    description: string
    price?: string
    signupStarts: string
    signupEnds?: string
    bannerImg?: string
    minParticipants?: string
    maxParticipants?: string
    quotas?: Map<string, string>[]
    prettyPrintQuotas?: string
    modalInputGroup?: string
    modalInputQuota?: string
    // Visibility modifiers
    isLoading: boolean
    endDateVisible: boolean
    signupEndDateVisible: boolean
    hasParticipantLimits: boolean
    hasQuotas: boolean
    isModalVisible: boolean
    isFormBuilderVisible: boolean
    showSuccess: boolean
    showError: boolean
    isSubmitted: boolean
    showUploadError: boolean
    showImageFileError: boolean
    // Others
    selectedFile?: string
    uploadErrorMessage?: string
}

export default class NewEvent extends Component<NewEventProps, NewEventState> {
    private readonly initialState: NewEventState
    private readonly classNameLoading = "control is-loading"
    private readonly classNameNotLoading = "control"
    private readonly classNameModalActive = "modal is-active"
    private readonly classNameModalNonActive = "modal"
    private readonly classNameMessageSuccess = "message is-success"
    private readonly classNameMessageFailure = "message is-danger"
    private latestIndex = 0
    private tempQuotas: Map<string, string>[] = []
    private newEvent: Event | undefined
    private formBuilderData: {} | any

    constructor(props: NewEventProps | Readonly<NewEventProps>) {
        super(props);
        this.initialState = {
            description: "",
            endDateVisible: false,
            hasParticipantLimits: false,
            hasQuotas: false,
            isLoading: false,
            isModalVisible: false,
            name: "",
            place: "",
            signupEndDateVisible: false,
            signupStarts: "",
            startDate: "",
            isFormBuilderVisible: false,
            showSuccess: false,
            showError: false,
            isSubmitted: false,
            showUploadError: false,
            showImageFileError: false
        }
        this.state = Object.assign(this.cloneInitialState(), {'quotas': [new Map<string, string>()]})
        this.addInputRow = this.addInputRow.bind(this)
        this.showModal = this.showModal.bind(this)
        this.hideModal = this.hideModal.bind(this)
        this.saveQuotas = this.saveQuotas.bind(this)
        this.resetForm = this.resetForm.bind(this)
        this.cloneInitialState = this.cloneInitialState.bind(this)
        this.saveForm = this.saveForm.bind(this)
        this.saveFormBuilder = this.saveFormBuilder.bind(this)
        this.saveForm = this.saveForm.bind(this)
        this.handleFormBuilderPost = this.handleFormBuilderPost.bind(this)
        this.closeMessage = this.closeMessage.bind(this)
    }

    private cloneInitialState(): any {
        return JSON.parse(JSON.stringify(this.initialState))
    }

    private formatQuotas(): string {
        let returnValue = ""
        if (this.tempQuotas && this.tempQuotas.length) {
            this.tempQuotas.forEach(quota => {
                returnValue += quota.entries().next().value + "\n"
            })
        }
        return returnValue
    }

    private showModal(): void {
        this.setState({
            'isModalVisible': true
        })
    }

    private hideModal(): void {
        this.setState({
            'isModalVisible': false
        })
    }

    private saveQuotas(): void {
        this.setState({
            'isLoading': true
        })
        this.saveQuota()
        this.setState({
            'prettyPrintQuotas': this.formatQuotas(),
            'isLoading': false
        })
        this.hideModal()
    }

    private addInputRow(): void {
        this.saveQuota()
        this.state.quotas?.push(new Map<string, string>())
    }

    private saveQuotaGroup(value: string, index: number): void {
        this.setState({
            'modalInputGroup': value
        })
        this.latestIndex = index
    }

    private saveQuotaValue(value: string, index: number): void {
        this.setState({
            'modalInputQuota': value
        })
        this.latestIndex = index
    }

    private saveQuota(): void {
        const newQuota = new Map<string, string>()
        newQuota.set(this.state.modalInputGroup as string, this.state.modalInputQuota as string)
        // @ts-ignore
        this.state.quotas[this.latestIndex] = newQuota // FIXME "Do not mutate state directly. Use setState()"
        this.setState({
            'modalInputGroup': "",
            'modalInputQuota': ""
        })
        this.tempQuotas.push(newQuota)
    }

    private resetForm(): void {
        this.setState(Object.assign(this.cloneInitialState(), {
            quotas: [],
            endDate: "",
            price: "",
            signupEnds: "",
            bannerImg: "",
            minParticipants: "",
            maxParticipants: "",
            prettyPrintQuotas: "",
            modalInputGroup: "",
            modalInputQuota: "",
            selectedFile: null
        }))
        this.tempQuotas = []
    }

    private saveForm(): void {
        this.newEvent = {
            description: this.state.description,
            place: this.state.place,
            signupStarts: this.convertLocalDateToUTCISOString(this.state.signupStarts),
            startDate: this.convertLocalDateToUTCISOString(this.state.startDate),
            name: this.state.name
        }
        if (Object.hasOwn(this.state, "bannerImg")) {
            this.newEvent.bannerImg = this.state.bannerImg
        }
        if (Object.hasOwn(this.state, "endDate")) {
            this.newEvent.endDate = this.convertLocalDateToUTCISOString(this.state.endDate as string)
        }
        if (Object.hasOwn(this.state, "maxParticipants")) {
            this.newEvent.maxParticipants = Number(this.state.maxParticipants)
        }
        if (Object.hasOwn(this.state, "minParticipants")) {
            this.newEvent.minParticipants = Number(this.state.minParticipants)
        }
        if (Object.hasOwn(this.state, "price")) {
            this.newEvent.price = Number(this.state.price)
        }
        if (Object.hasOwn(this.state, "quotas")) {
            let newQuotasMap = new Map<string, string>()
            this.state.quotas?.forEach(quota => {
                newQuotasMap = new Map<string, string>([...newQuotasMap, ...quota])
            })
            this.newEvent.quotas = Object.fromEntries(newQuotasMap)
        }
        if (Object.hasOwn(this.state, "signupEnds")) {
            this.newEvent.signupEnds = this.convertLocalDateToUTCISOString(this.state.signupEnds as string)
        }
        this.setState({
            'isFormBuilderVisible': true
        })
    }

    // Source: https://stackoverflow.com/a/6777470
    // FIXME does not always work!
    private convertLocalDateToUTCISOString(inputDate: string | number | Date): string {
        const date = new Date(inputDate)
        const inputInUTC = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
            date.getUTCDate(), date.getUTCHours(),
            date.getUTCMinutes(), date.getUTCSeconds())
        return new Date(inputInUTC).toISOString()
    }

    private handleFormBuilderPost(data: {}) {
        this.formBuilderData = data
    }

    private saveFormBuilder(): void {
        if (typeof this.newEvent !== "undefined") {
            this.newEvent.form = {'formData': this.formBuilderData}
        }
        // this.setState({'isLoading': true})
        postEvent("/event/create", this.newEvent)
            .then(response => {
                if (response.ok) {
                    this.setState({
                        'showSuccess': true,
                        'isFormBuilderVisible': false,
                        'isSubmitted': true,
                        'isLoading': false
                    })
                }
            })
            .catch(error => {
                this.setState({
                    'showError': true,
                    'isFormBuilderVisible': false,
                    'isSubmitted': true,
                    'isLoading': false
                })
            })
    }

    private closeMessage(): void {
        this.setState({'showError': false, 'showSuccess': false, 'isFormBuilderVisible': false})
    }

    private async handleImageUpload(file: File) {
        let dataToUpload: Blob
        file.arrayBuffer().then((arrayBuffer) => {
            dataToUpload = new Blob([new Uint8Array(arrayBuffer)], {type: file.type})
        })
            .catch(error => {
                // FIXME do something else instead of logging
                console.log(error)
            })
        postImageData("/event/banner/add", file)
            .then(async response => {
                if (response.ok) {
                    const responseJson = await response.json()
                    this.setState({'bannerImg': responseJson.fileName})
                }
                if (response.status === 406) {
                    this.setState({'showImageFileError': true, 'uploadErrorMessage': response.statusText})
                }
                if (response.status === 500) {
                    this.setState({'showUploadError': true})
                }
            })
            .catch(error => {
                this.setState({'showUploadError': true})
            })
        this.setState({'isLoading': false})
    }

    private deleteQuotaRow(index: number) {
        // @ts-ignore
        const quotaCopy = [...this.state.quotas]
        quotaCopy.splice(index, 1)
        this.tempQuotas.splice(index, 1)
        this.setState({
            'quotas': quotaCopy,
            'prettyPrintQuotas': this.formatQuotas()
        })

    }

    render() {
        return (
            <>
                {(!this.state.isSubmitted && !this.state.isFormBuilderVisible) &&
                    <section className={"section"}>
                        <p>
                            Pakolliset kentät on merkitty tähdellä (*).
                        </p>
                        <div className={"field"}>
                            <label className={"label"}>Tapahtuman nimi*</label>
                            <div className={"control"}>
                                <input id={"name"} name={"name"} className={"input"} type={"text"}
                                       value={this.state.name}
                                       required={true}
                                       onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({'name': e.target.value})}/>
                            </div>
                        </div>
                        <div className={"field"}>
                            <label className={"label"}>Tapahtuman paikka*</label>
                            <div className={"control"}>
                                <input id={"place"} name={"place"} className={"input"} type={"text"}
                                       value={this.state.place}
                                       required={true}
                                       onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({'place': e.target.value})}/>
                            </div>
                        </div>
                        <div className={"field"}>
                            <label className={"label"}>Tapahtuman kuvaus*</label>
                            <div className={"control"}>
                        <textarea id={"description"} name={"description"} className={"textarea"}
                                  value={this.state.description}
                                  required={true}
                                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => this.setState({'description': e.target.value})}/>
                            </div>
                        </div>
                        <div className={"field"}>
                            <label className={"label"}>Tapahtuman hinta</label>
                            <div className={"control"}>
                                <input id={"price"} name={"price"} className={"input"} type={"number"}
                                       value={this.state.price}
                                       required={false}
                                       onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({'price': e.target.value})}/>
                            </div>
                        </div>
                        <label
                            className={"label"}>{this.state.endDateVisible ? "Tapahtuman aloituspäivä*" : "Tapahtuman ajankohta*"}</label>
                        <div className={"field is-grouped"}>
                            <div className={"control"}>
                                <input id={"startDate"} name={"startDate"} className={"input"} type={"datetime-local"}
                                       value={this.state.startDate}
                                       required={true}
                                       onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({'startDate': e.target.value})}/>
                            </div>
                            <div className={"control"}>
                                <label className="checkbox">
                                    <input type="checkbox" className={"checkbox"} checked={this.state.endDateVisible}
                                           onChange={(event: ChangeEvent<HTMLInputElement>) => this.setState({'endDateVisible': event.target.checked})}/>
                                    Tapahtumalla on myös lopetuspäivä
                                </label>
                            </div>
                        </div>
                        {this.state.endDateVisible &&
                            <div className={"field"}>
                                <label className={"label"}>Tapahtuman lopetuspäivä</label>
                                <div className={"control"}>
                                    <input id={"endDate"} name={"endDate"} className={"input"} type={"datetime-local"}
                                           value={this.state.endDate}
                                           required={false}
                                           onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({'endDate': e.target.value})}/>
                                </div>
                            </div>
                        }
                        <label className={"label"}>Ilmoittautuminen alkaa*</label>
                        <div className={"field is-grouped"}>
                            <div className={"control"}>
                                <input id={"signupStarts"} name={"signupStarts"} className={"input"}
                                       type={"datetime-local"}
                                       value={this.state.signupStarts}
                                       required={true}
                                       onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({'signupStarts': e.target.value})}/>
                            </div>
                            <div className={"control"}>
                                <label className="checkbox">
                                    <input type="checkbox" className={"checkbox"}
                                           checked={this.state.signupEndDateVisible}
                                           onChange={(event: ChangeEvent<HTMLInputElement>) => this.setState({'signupEndDateVisible': event.target.checked})}/>
                                    Tapahtumaan ilmoittautumisella on myös päättymispäivä
                                </label>
                            </div>
                        </div>
                        {this.state.signupEndDateVisible &&
                            <div className={"field"}>
                                <label className={"label"}>Ilmoittautuminen päättyy</label>
                                <div className={"control"}>
                                    <input id={"signupEnds"} name={"signupEnds"} className={"input"}
                                           type={"datetime-local"}
                                           value={this.state.signupEnds}
                                           required={false}
                                           onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({'signupEnds': e.target.value})}/>
                                </div>
                            </div>
                        }
                        <label className={"label"}>Kuva</label>
                        <div className="file is-right is-fullwidth">
                            <label className="file-label">
                                <div
                                    className={this.state.isLoading ? this.classNameLoading : this.classNameNotLoading}>
                                    <input id={"image"} className="file-input" type="file" name="image"
                                           onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                               if (e.target.files !== null && e.target.files.length > 0) {
                                                   this.setState({
                                                       'isLoading': true,
                                                       'selectedFile': e.target.files[0].name
                                                   })
                                                   this.handleImageUpload(e.target.files[0])
                                               }
                                           }} onClick={() => {
                                        this.setState({'isLoading': true})
                                    }} alt={"Lisää kuva"}/>
                                </div>
                                <span className="file-cta">
                                  <span className="file-icon">
                                    <i className="fas fa-upload"></i>
                                  </span>
                                  <span className="file-label">Valitse kuva…</span>
                            </span>
                                <span className="file-name">{this.state.selectedFile}</span>
                            </label>
                            {this.state.showImageFileError &&
                                <p className="help is-danger">{this.state.uploadErrorMessage}</p>
                            }
                        </div>
                        <div className={"control"}>
                            <label className="checkbox">
                                <input type="checkbox" className={"checkbox"} checked={this.state.hasParticipantLimits}
                                       onChange={(event: ChangeEvent<HTMLInputElement>) => this.setState({'hasParticipantLimits': event.target.checked})}/>
                                Tapahtumalla on osallistujamäärä rajoituksia
                            </label>
                        </div>
                        {this.state.hasParticipantLimits && <>
                            <div className={"field"}>
                                <label className={"label"}>Minimi osallistujamäärä</label>
                                <div className={"control"}>
                                    <input id={"minParticipants"} name={"minParticipants"} className={"input"}
                                           type={"number"}
                                           value={this.state.minParticipants}
                                           required={false}
                                           onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({'minParticipants': e.target.value})}/>
                                </div>
                            </div>
                            <div className={"field"}>
                                <label className={"label"}>Maksimi osallistujamäärä</label>
                                <div className={"control"}>
                                    <input id={"maxParticipants"} name={"maxParticipants"} className={"input"}
                                           type={"number"}
                                           value={this.state.maxParticipants}
                                           required={false}
                                           onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({'maxParticipants': e.target.value})}/>
                                </div>
                            </div>
                        </>
                        }
                        <div className={"control"}>
                            <label className="checkbox">
                                <input type="checkbox" className={"checkbox"} checked={this.state.hasQuotas}
                                       onChange={(event: ChangeEvent<HTMLInputElement>) => this.setState({'hasQuotas': event.target.checked})}/>
                                Tapahtumalla on osallistujakiintijöitä
                            </label>
                        </div>
                        {this.state.hasQuotas && <>
                            <label className={"label"}>Osallistujakiintiöt</label>
                            <div className={"field is-grouped"}>
                                <div className={"control"}>
                                <textarea id={"quotas"} name={"quotas"} className={"textarea"} readOnly={true}
                                          value={this.state.prettyPrintQuotas}
                                          required={false} disabled={true}/>
                                </div>
                                <button
                                    className={"button"}
                                    onClick={this.showModal}>{(this.state.quotas && this.state.quotas.length) ? "Muokkaa kiintiöitä" : "Lisää kiintiöitä"}</button>
                            </div>
                        </>
                        }
                        <div className={"field is-grouped"}>
                            <button className="button is-link" onClick={this.saveForm}>Jatka</button>
                            <button className="button is-text" type={"reset"} onClick={this.resetForm}>Tyhjennä</button>
                        </div>

                    </section>
                }
                {this.state.isModalVisible &&
                    <div
                        className={this.state.isModalVisible ? this.classNameModalActive : this.classNameModalNonActive}>
                        <div className="modal-background"></div>
                        <div className="modal-card">
                            <header className="modal-card-head">
                                <p className="modal-card-title">Osallistumiskiintiöt</p>
                                <button className="delete" aria-label="close" onClick={this.hideModal}></button>
                            </header>
                            <section className="modal-card-body">

                                <div className={"field"}>
                                    <button className={"button is-small"} onClick={this.addInputRow}>Lisää uusi kiintiö
                                    </button>
                                </div>
                                {this.state.quotas?.map((quota, index: number) => (
                                    <div className={"field is-grouped"}>
                                        <div className={"control"}>
                                            <input key={index.toString()} name={"group_" + index.toString()}
                                                   value={Array.from(quota.keys())[0]} placeholder={"Käyttäjäryhmä"}
                                                   onChange={e => this.saveQuotaGroup(e.target.value, index)}/>
                                        </div>
                                        <div className={"control"}>
                                            <input type={"number"} key={Array.from(quota.keys())[0]}
                                                   name={"quota_" + index.toString()}
                                                   value={Array.from(quota.values())[0]} placeholder={"Kiintiö"}
                                                   onChange={e => this.saveQuotaValue(e.target.value, index)}/>
                                        </div>
                                        <div className={"control"}>
                                            <button className="delete" onClick={() => this.deleteQuotaRow(index)}></button>
                                        </div>
                                    </div>
                                ))
                                }
                                <div className={"field is-grouped"}>
                                    <div
                                        className={this.state.isLoading ? this.classNameLoading : this.classNameNotLoading}>
                                        <button className={"button"} onClick={this.saveQuotas}>Tallenna</button>
                                    </div>
                                    <button className={"button"} onClick={this.hideModal}>Peruuta</button>
                                </div>
                            </section>
                            {/*<footer className="modal-card-foot">*/}
                            {/*    <button className="button is-success" onClick={saveQuotas}>Tallenna</button>*/}
                            {/*    <button className="button is-text" onClick={hideModal}>Peruuta</button>*/}
                            {/*</footer>*/}
                        </div>
                    </div>
                }
                {this.state.isFormBuilderVisible &&
                    <section className={"section"}>
                        <div className={"field is-grouped"}>
                            <button className={"button"}
                                    onClick={() => this.setState({'isFormBuilderVisible': false})}>Takaisin
                            </button>
                            <button className={"button"} onClick={this.saveFormBuilder}>Tallenna</button>
                        </div>
                        {!this.formBuilderData ?
                            <ReactFormBuilder
                                onPost={this.handleFormBuilderPost}
                            />
                            :
                            <ReactFormGenerator
                                form_action={""}
                                form_method={"POST"}
                                data={this.formBuilderData}
                                action_name={"Lisää tapahtuma"}
                                back_name={"Peruuta"}
                                onSubmit={this.saveFormBuilder}
                            />
                        }
                    </section>
                }
                {(this.state.showSuccess || this.state.showError) &&
                    <>
                        <article
                            className={this.state.showSuccess ? this.classNameMessageSuccess : (this.state.showError ? this.classNameMessageFailure : "message")}>
                            <div className="message-header">
                                <p>{this.state.showSuccess ? "Tapahtuman luonti onnistui" : (this.state.showError ? "Tapahtuman luonti epäonnistui" : "Virhe")}</p>
                                <button className="delete" aria-label="delete" onClick={this.closeMessage}></button>
                            </div>
                            <div className="message-body">
                                {this.state.showSuccess &&
                                    <>
                                        Tapahtuman "{this.newEvent?.name}" luonti onnistui. Luoneen käyttäjän
                                        rekisteröityyn
                                        sähköpostiosoitteeseen on lähetetty vahvistusviesti. Mikäli sähköposti ei ole
                                        saapunut, ota yhteyttä järjestelmän ylläpitäjään.
                                    </>
                                }
                                {this.state.showError &&
                                    <>
                                        Tapahtuman luonti epäonnistui.
                                    </>
                                }
                            </div>
                        </article>
                        <div className={"field is-grouped"}>
                            <div className={"control"}>
                                {this.state.showSuccess &&
                                    <button className={"button is-link"} onClick={this.resetForm}>Luo uusi
                                        tapahtuma</button>
                                }
                            </div>
                            {this.state.showError &&
                                <div className={"control"}>
                                    <button className={"button is-link"} onClick={() => this.setState({
                                        'isSubmitted': false,
                                        'showError': false,
                                        'isFormBuilderVisible': false
                                    })}>Muokkaa
                                    </button>
                                    <button className={"button is-link"} onClick={this.saveFormBuilder}>Lähetä
                                        uudestaan
                                    </button>
                                    <button className={"button is-danger"} onClick={this.resetForm}>Aloita alusta
                                    </button>
                                </div>
                            }
                        </div>

                    </>
                }
                {/*<ClipLoader color={'#fff'} loading={this.state.isLoading} size={150}/>*/}
            </>
        )
    }
}
