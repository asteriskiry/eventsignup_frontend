/*
Copyright Juhani Vähä-Mäkilä (juhani@fmail.co.uk) 2022.
Licenced under EUROPEAN UNION PUBLIC LICENCE v. 1.2.
 */
import {useRouteError} from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError();

    return (
        <div className="container is-fluid">
            <div className="notification">
                <h1>Oops!</h1>
                <div className="section">
                    <p>Sorry, an unexpected error has occurred.</p>
                    <p>
                        <i>{error.statusText || error.message}</i>
                    </p>
                </div>
            </div>
        </div>
    );
}
