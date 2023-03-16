/*
Copyright Juhani Vähä-Mäkilä (juhani@fmail.co.uk) 2022.
Licenced under EUROPEAN UNION PUBLIC LICENCE v. 1.2.
 */ /*
import { ChangeEvent, Component } from 'react'
import { Event } from '../types/Event'
import { ReactFormBuilder, ReactFormGenerator } from 'react-form-builder2'
import 'react-form-builder2/dist/app.css'
import {
  convertLocalDateToUTCISOString,
  postEvent,
  postImageData,
} from './Utilities'
import { Quota } from '../types/Quota'

interface NewEventProps {}

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
  quotas?: Quota[]
  prettyPrintQuotas?: string
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
  showImageFileServerError: boolean
  showImageFileSuccess: boolean
  // Others
  selectedFile?: string
  uploadErrorMessage?: string
}

export default class NewEvent extends Component<NewEventProps, NewEventState> {
  private readonly initialState: NewEventState
  private readonly classNameLoading = 'control is-loading'
  private readonly classNameNotLoading = 'control'
  private readonly classNameModalActive = 'modal is-active'
  private readonly classNameModalNonActive = 'modal'
  private readonly classNameMessageSuccess = 'message is-success'
  private readonly classNameMessageFailure = 'message is-danger'
  private tempQuotas: Quota[] = []
  private newEvent: Event | undefined
  private formBuilderData: {} | any

  constructor(props: NewEventProps | Readonly<NewEventProps>) {
    super(props)
    this.initialState = {
      description: '',
      endDateVisible: false,
      hasParticipantLimits: false,
      hasQuotas: false,
      isLoading: false,
      isModalVisible: false,
      name: '',
      place: '',
      signupEndDateVisible: false,
      signupStarts: '',
      startDate: '',
      isFormBuilderVisible: false,
      showSuccess: false,
      showError: false,
      isSubmitted: false,
      showUploadError: false,
      showImageFileError: false,
      showImageFileSuccess: false,
      showImageFileServerError: false,
    }
    this.state = Object.assign(this.cloneInitialState(), {
      quotas: [{ group: '', quota: '' }],
    })
    this.addInputRowForQuotas = this.addInputRowForQuotas.bind(this)
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

  // Quota handling related functions
  private formatQuotas(): string {
    let returnValue = ''
    if (this.tempQuotas && this.tempQuotas.length) {
      this.tempQuotas.forEach((quota) => {
        returnValue += quota.group + ': ' + quota.quota + '\n'
      })
    }
    return returnValue
  }

  private saveQuotas(): void {
    this.setState({
      prettyPrintQuotas: this.formatQuotas(),
      isLoading: false,
    })
    this.hideModal()
  }

  private addInputRowForQuotas(): void {
    // @ts-ignore
    const values = [...this.state.quotas]
    values.push({ group: '', quota: '' } as Quota)
    this.setState({
      quotas: values,
    })
  }

  private handleHasQuotaChange(event: ChangeEvent<HTMLInputElement>): void {
    if (!event.target.checked) {
      this.emptyQuotas()
    }
    this.setState({
      hasQuotas: event.target.checked,
    })
  }

  private handleQuotaChange(
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ): void {
    const values = [...this.state.quotas]
    values[index][event.target.name] = event.target.value
    this.setState({
      quotas: values,
    })
    this.tempQuotas = values
  }

  private emptyQuotas(): void {
    this.tempQuotas.length = 0 // see: https://stackoverflow.com/a/1232046
    this.setState({
      quotas: [{ group: '', quota: '' } as Quota],
      prettyPrintQuotas: '',
    })
  }

  private quotaHasValidItems() {
    // Length is never zero and lengths > 1 are always valid
    if (this.state.quotas && this.state.quotas?.length === 1) {
      return (
        this.state.quotas[0].quota !== '' && this.state.quotas[0].group !== ''
      )
    }
    return true
  }

  private deleteQuotaRow(index: number) {
    // @ts-ignore
    const quotaCopy = [...this.state.quotas]
    quotaCopy.splice(index, 1)
    this.tempQuotas.splice(index, 1)
    this.setState({
      quotas: quotaCopy,
      prettyPrintQuotas: this.formatQuotas(),
    })
  }

  // Form saving related functions
  private saveForm(): void {
    this.newEvent = {
      description: this.state.description,
      place: this.state.place,
      signupStarts: convertLocalDateToUTCISOString(this.state.signupStarts),
      startDate: convertLocalDateToUTCISOString(this.state.startDate),
      name: this.state.name,
    }
    if (Object.hasOwn(this.state, 'bannerImg')) {
      this.newEvent.bannerImg = this.state.bannerImg
    }
    if (Object.hasOwn(this.state, 'endDate') && this.state.endDate !== '') {
      this.newEvent.endDate = convertLocalDateToUTCISOString(
        this.state.endDate as string
      )
    }
    if (
      Object.hasOwn(this.state, 'maxParticipants') &&
      this.state.maxParticipants !== ''
    ) {
      this.newEvent.maxParticipants = Number(this.state.maxParticipants)
    }
    if (
      Object.hasOwn(this.state, 'minParticipants') &&
      this.state.minParticipants !== ''
    ) {
      this.newEvent.minParticipants = Number(this.state.minParticipants)
    }
    if (Object.hasOwn(this.state, 'price')) {
      this.newEvent.price = Number(this.state.price)
    }
    if (Object.hasOwn(this.state, 'quotas') && this.quotaHasValidItems()) {
      this.newEvent.quotas = this.state.quotas
    }
    if (
      Object.hasOwn(this.state, 'signupEnds') &&
      this.state.signupEnds !== ''
    ) {
      this.newEvent.signupEnds = convertLocalDateToUTCISOString(
        this.state.signupEnds as string
      )
    }
    this.setState({
      isFormBuilderVisible: true,
    })
  }

  private handleFormBuilderPost(data: {}) {
    this.formBuilderData = data
  }

  private saveFormBuilder(): void {
    if (typeof this.newEvent !== 'undefined') {
      this.newEvent.form = { formData: this.formBuilderData }
    }
    postEvent('/api/event/create', this.newEvent)
      .then((response) => {
        if (response.ok) {
          this.setState({
            showSuccess: true,
            isFormBuilderVisible: false,
            isSubmitted: true,
            isLoading: false,
          })
        }
        if (response.status === 400 || response.status === 500) {
          this.setState({
            showError: true,
            isFormBuilderVisible: false,
            isSubmitted: false,
            isLoading: false,
          })
        }
      })
      .catch((error) => {
        this.setState({
          showError: true,
          isFormBuilderVisible: false,
          isSubmitted: true,
          isLoading: false,
        })
      })
  }

  private async handleImageUpload(file: File) {
    postImageData('/api/event/banner/add', file)
      .then(async (response) => {
        if (response.ok) {
          const responseJson = await response.json()
          this.setState({
            bannerImg: responseJson.fileName,
            showImageFileSuccess: true,
          })
        }
        if (response.status === 406) {
          this.setState({
            showImageFileError: true,
            uploadErrorMessage: response.statusText,
          })
        }
        if (response.status === 500) {
          this.setState({
            showImageFileServerError: true,
            uploadErrorMessage: response.statusText,
          })
        }
      })
      .catch((error) => {
        this.setState({
          showUploadError: true,
        })
      })
    this.setState({
      isLoading: false,
    })
  }

  // Form element related functions
  private closeMessage(): void {
    this.setState({
      showError: false,
      showSuccess: false,
      isFormBuilderVisible: false,
    })
  }

  private handleEndDateStatus(checked: boolean) {
    if (!checked) {
      this.setState({
        endDateVisible: checked,
        endDate: '',
      })
    } else {
      this.setState({
        endDateVisible: checked,
      })
    }
  }

  private handleSignupEndsStatus(checked: boolean) {
    if (!checked) {
      this.setState({
        signupEnds: '',
        signupEndDateVisible: checked,
      })
    } else {
      this.setState({
        signupEndDateVisible: checked,
      })
    }
  }

  private handleParticipantLimitsStatus(checked: boolean) {
    if (!checked) {
      this.setState({
        hasParticipantLimits: checked,
        minParticipants: '',
        maxParticipants: '',
      })
    } else {
      this.setState({
        hasParticipantLimits: checked,
      })
    }
  }

  private handleInputChange(
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ): void {
    // @ts-ignore
    this.setState({ [event.target.name]: event.target.value })
  }

  private showModal(): void {
    this.setState({
      isModalVisible: true,
    })
  }

  private hideModal(): void {
    this.setState({
      isModalVisible: false,
    })
  }

  // Other functions
  private cloneInitialState(): any {
    return JSON.parse(JSON.stringify(this.initialState))
  }

  private resetForm(): void {
    this.setState(
      Object.assign(this.cloneInitialState(), {
        quotas: [],
        endDate: '',
        price: '',
        signupEnds: '',
        bannerImg: '',
        minParticipants: '',
        maxParticipants: '',
        prettyPrintQuotas: '',
        selectedFile: null,
      })
    )
    this.tempQuotas.length = 0 // see: https://stackoverflow.com/a/1232046
  }

  render() {
    return (
      <>
        {!this.state.isSubmitted && !this.state.isFormBuilderVisible && (
          <div className={'columns is-gapless is-centered'}>
            <div className={'column is-half'}>
              <section className={'section'}>
                <p>Pakolliset kentät on merkitty tähdellä (*).</p>
                <div className={'field'}>
                  <label className={'label'}>Tapahtuman nimi*</label>
                  <div className={'control'}>
                    <input
                      id={'name'}
                      name={'name'}
                      className={'input'}
                      type={'text'}
                      value={this.state.name}
                      required={true}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        this.handleInputChange(e)
                      }
                    />
                  </div>
                </div>
                <div className={'field'}>
                  <label className={'label'}>Tapahtuman paikka*</label>
                  <div className={'control'}>
                    <input
                      id={'place'}
                      name={'place'}
                      className={'input'}
                      type={'text'}
                      value={this.state.place}
                      required={true}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        this.handleInputChange(e)
                      }
                    />
                  </div>
                </div>
                <div className={'field'}>
                  <label className={'label'}>Tapahtuman kuvaus*</label>
                  <div className={'control'}>
                    <textarea
                      id={'description'}
                      name={'description'}
                      className={'textarea'}
                      value={this.state.description}
                      required={true}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        this.handleInputChange(e)
                      }
                    />
                  </div>
                </div>
                <div className={'field'}>
                  <label className={'label'}>Tapahtuman hinta</label>
                  <div className={'control'}>
                    <input
                      id={'price'}
                      name={'price'}
                      className={'input'}
                      type={'number'}
                      value={this.state.price}
                      required={false}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        this.handleInputChange(e)
                      }
                    />
                  </div>
                </div>
                <label className={'label'}>
                  {this.state.endDateVisible
                    ? 'Tapahtuman aloituspäivä*'
                    : 'Tapahtuman ajankohta*'}
                </label>
                <div className={'field is-grouped'}>
                  <div className={'control'}>
                    <input
                      id={'startDate'}
                      name={'startDate'}
                      className={'input'}
                      type={'datetime-local'}
                      value={this.state.startDate}
                      required={true}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        this.handleInputChange(e)
                      }
                    />
                  </div>
                  <div className={'control'}>
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        className={'checkbox'}
                        checked={this.state.endDateVisible}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                          this.handleEndDateStatus(event.target.checked)
                        }
                      />
                      Tapahtumalla on myös lopetuspäivä
                    </label>
                  </div>
                </div>
                {this.state.endDateVisible && (
                  <div className={'field'}>
                    <label className={'label'}>Tapahtuman lopetuspäivä</label>
                    <div className={'control'}>
                      <input
                        id={'endDate'}
                        name={'endDate'}
                        className={'input'}
                        type={'datetime-local'}
                        value={this.state.endDate}
                        required={false}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          this.handleInputChange(e)
                        }
                      />
                    </div>
                  </div>
                )}
                <label className={'label'}>Ilmoittautuminen alkaa*</label>
                <div className={'field is-grouped'}>
                  <div className={'control'}>
                    <input
                      id={'signupStarts'}
                      name={'signupStarts'}
                      className={'input'}
                      type={'datetime-local'}
                      value={this.state.signupStarts}
                      required={true}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        this.handleInputChange(e)
                      }
                    />
                  </div>
                  <div className={'control'}>
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        className={'checkbox'}
                        checked={this.state.signupEndDateVisible}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                          this.handleSignupEndsStatus(event.target.checked)
                        }
                      />
                      Tapahtumaan ilmoittautumisella on myös päättymispäivä
                    </label>
                  </div>
                </div>
                {this.state.signupEndDateVisible && (
                  <div className={'field'}>
                    <label className={'label'}>Ilmoittautuminen päättyy</label>
                    <div className={'control'}>
                      <input
                        id={'signupEnds'}
                        name={'signupEnds'}
                        className={'input'}
                        type={'datetime-local'}
                        value={this.state.signupEnds}
                        required={false}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          this.handleInputChange(e)
                        }
                      />
                    </div>
                  </div>
                )}
                <label className={'label'}>Kuva</label>
                <div className="file is-right is-fullwidth">
                  <label className="file-label">
                    <div
                      className={
                        this.state.isLoading
                          ? this.classNameLoading
                          : this.classNameNotLoading
                      }
                    >
                      <input
                        id={'image'}
                        className="file-input"
                        type="file"
                        name="image"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          if (
                            e.target.files !== null &&
                            e.target.files.length > 0
                          ) {
                            this.setState({
                              isLoading: true,
                              selectedFile: e.target.files[0].name,
                            })
                            this.handleImageUpload(e.target.files[0])
                          }
                        }}
                        onClick={() => {
                          this.setState({ isLoading: true })
                        }}
                        alt={'Lisää kuva'}
                      />
                    </div>
                    <span className="file-cta">
                      <span className="file-icon">
                        <i className="fas fa-upload"></i>
                      </span>
                      <span className="file-label">Valitse kuva…</span>
                    </span>
                    <span className="file-name">{this.state.selectedFile}</span>
                  </label>
                </div>
                {this.state.showImageFileError && (
                  <div className="notification is-danger is-light">
                    <button
                      className="delete"
                      onClick={() =>
                        this.setState({ showImageFileError: false })
                      }
                    ></button>
                    Valittu tiedosto ei ole validi kuvatiedosto. Ole hyvä ja
                    valitse toinen tiedosto.
                  </div>
                )}
                {this.state.showImageFileServerError && (
                  <div className="notification is-warning is-light">
                    <button
                      className="delete"
                      onClick={() =>
                        this.setState({ showImageFileServerError: false })
                      }
                    ></button>
                    Tallennuksessa tapahtui tuntematon virhe. Yritä myöhemmin
                    uudestaan.
                    <br />
                    Mikäli virhe ei poistu, ota yhteyttä sivuston ylläpitäjään.
                  </div>
                )}
                {this.state.showImageFileSuccess && (
                  <div className="notification is-success is-light">
                    <button
                      className="delete"
                      onClick={() =>
                        this.setState({ showImageFileSuccess: false })
                      }
                    ></button>
                    Kuvan tallennus onnistui!
                  </div>
                )}
                <div className={'control'}>
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      className={'checkbox'}
                      checked={this.state.hasParticipantLimits}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        this.handleParticipantLimitsStatus(event.target.checked)
                      }
                    />
                    Tapahtumalla on osallistujamäärä rajoituksia
                  </label>
                </div>
                {this.state.hasParticipantLimits && (
                  <>
                    <div className={'field'}>
                      <label className={'label'}>Minimi osallistujamäärä</label>
                      <div className={'control'}>
                        <input
                          id={'minParticipants'}
                          name={'minParticipants'}
                          className={'input'}
                          type={'number'}
                          value={this.state.minParticipants}
                          required={false}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            this.handleInputChange(e)
                          }
                        />
                      </div>
                    </div>
                    <div className={'field'}>
                      <label className={'label'}>
                        Maksimi osallistujamäärä
                      </label>
                      <div className={'control'}>
                        <input
                          id={'maxParticipants'}
                          name={'maxParticipants'}
                          className={'input'}
                          type={'number'}
                          value={this.state.maxParticipants}
                          required={false}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            this.handleInputChange(e)
                          }
                        />
                      </div>
                    </div>
                  </>
                )}
                <div className={'control'}>
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      className={'checkbox'}
                      checked={this.state.hasQuotas}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        this.handleHasQuotaChange(event)
                      }
                    />
                    Tapahtumalla on osallistujakiintijöitä
                  </label>
                </div>
                {this.state.hasQuotas && (
                  <>
                    <label className={'label'}>Osallistujakiintiöt</label>
                    <div className={'field is-grouped'}>
                      <div className={'control'}>
                        <textarea
                          id={'quotas'}
                          name={'quotas'}
                          className={'textarea'}
                          readOnly={true}
                          value={this.state.prettyPrintQuotas}
                          required={false}
                          disabled={true}
                        />
                      </div>
                      <button className={'button'} onClick={this.showModal}>
                        {this.quotaHasValidItems()
                          ? 'Muokkaa kiintiöitä'
                          : 'Lisää kiintiöitä'}
                      </button>
                    </div>
                  </>
                )}
                <div className={'field is-grouped'}>
                  <button className="button is-link" onClick={this.saveForm}>
                    Jatka
                  </button>
                  <button
                    className="button is-text"
                    type={'reset'}
                    onClick={this.resetForm}
                  >
                    Tyhjennä
                  </button>
                </div>
              </section>
            </div>
          </div>
        )}
        {this.state.isModalVisible && (
          <div
            className={
              this.state.isModalVisible
                ? this.classNameModalActive
                : this.classNameModalNonActive
            }
          >
            <div className="modal-background"></div>
            <div className="modal-card">
              <header className="modal-card-head">
                <p className="modal-card-title">Osallistumiskiintiöt</p>
                <button
                  className="delete"
                  aria-label="close"
                  onClick={this.hideModal}
                ></button>
              </header>
              <section className="modal-card-body">
                <div className={'field'}>
                  <button
                    className={'button is-small'}
                    onClick={this.addInputRowForQuotas}
                  >
                    Lisää uusi kiintiö
                  </button>
                </div>
                {this.state.quotas?.map((quota: Quota, index: number) => (
                  <div className={'field is-grouped'}>
                    <div className={'control'}>
                      <input
                        key={'group_' + index.toString()}
                        name={'group'}
                        value={quota.group}
                        placeholder={'Käyttäjäryhmä'}
                        onChange={(event) =>
                          this.handleQuotaChange(event, index)
                        }
                      />
                    </div>
                    <div className={'control'}>
                      <input
                        type={'number'}
                        key={'quota_' + index.toString()}
                        name={'quota'}
                        value={quota.quota}
                        placeholder={'Kiintiö'}
                        onChange={(event) =>
                          this.handleQuotaChange(event, index)
                        }
                      />
                    </div>
                    <div className={'control'}>
                      <button
                        className="delete"
                        onClick={() => this.deleteQuotaRow(index)}
                      ></button>
                    </div>
                  </div>
                ))}
                <div className={'field is-grouped'}>
                  <div
                    className={
                      this.state.isLoading
                        ? this.classNameLoading
                        : this.classNameNotLoading
                    }
                  >
                    <button className={'button'} onClick={this.saveQuotas}>
                      Tallenna
                    </button>
                  </div>
                  <button className={'button'} onClick={this.hideModal}>
                    Peruuta
                  </button>
                </div>
              </section>
            </div>
          </div>
        )}
        {this.state.isFormBuilderVisible && (
          <section className={'section'}>
            <div className={'field is-grouped'}>
              <button
                className={'button'}
                onClick={() => this.setState({ isFormBuilderVisible: false })}
              >
                Takaisin
              </button>
              <button className={'button'} onClick={this.saveFormBuilder}>
                Tallenna
              </button>
            </div>
            {!this.formBuilderData ? (
              <ReactFormBuilder onPost={this.handleFormBuilderPost} />
            ) : (
              <ReactFormGenerator
                form_action={''}
                form_method={'POST'}
                data={this.formBuilderData}
                action_name={'Lisää tapahtuma'}
                back_name={'Peruuta'}
                onSubmit={this.saveFormBuilder}
              />
            )}
          </section>
        )}
        {(this.state.showSuccess || this.state.showError) && (
          <>
            <article
              className={
                this.state.showSuccess
                  ? this.classNameMessageSuccess
                  : this.state.showError
                  ? this.classNameMessageFailure
                  : 'message'
              }
            >
              <div className="message-header">
                <p>
                  {this.state.showSuccess
                    ? 'Tapahtuman luonti onnistui'
                    : this.state.showError
                    ? 'Tapahtuman luonti epäonnistui'
                    : 'Virhe'}
                </p>
                <button
                  className="delete"
                  aria-label="delete"
                  onClick={this.closeMessage}
                ></button>
              </div>
              <div className="message-body">
                {this.state.showSuccess && (
                  <>
                    Tapahtuman "{this.newEvent?.name}" luonti onnistui. Luoneen
                    käyttäjän rekisteröityyn sähköpostiosoitteeseen on lähetetty
                    vahvistusviesti. Mikäli sähköposti ei ole saapunut, ota
                    yhteyttä järjestelmän ylläpitäjään.
                  </>
                )}
                {this.state.showError && <>Tapahtuman luonti epäonnistui.</>}
              </div>
            </article>
            <div className={'field is-grouped'}>
              <div className={'control'}>
                {this.state.showSuccess && (
                  <button className={'button is-link'} onClick={this.resetForm}>
                    Luo uusi tapahtuma
                  </button>
                )}
              </div>
              {this.state.showError && (
                <div className={'control'}>
                  <button
                    className={'button is-link'}
                    onClick={() =>
                      this.setState({
                        isSubmitted: false,
                        showError: false,
                        isFormBuilderVisible: false,
                      })
                    }
                  >
                    Muokkaa
                  </button>
                  <button
                    className={'button is-link'}
                    onClick={this.saveFormBuilder}
                  >
                    Lähetä uudestaan
                  </button>
                  <button
                    className={'button is-danger'}
                    onClick={this.resetForm}
                  >
                    Aloita alusta
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </>
    )
  }
}
*/

export {}