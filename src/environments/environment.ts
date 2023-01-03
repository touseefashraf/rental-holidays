export const environment = {
    production: false
}
//
export const apis = {

    baseUrl: 'https://camper-api.omairusaf.com/api',
    //baseUrl: 'https://apptbd.com/TbdApi/public/api',
    googleApiKey: 'AIzaSyBH2NFiXlM-Vt6Z08lo-26AvfyrOV9xvBM',
    googleCaptchaSiteKey: '6LcOuyYTAAAAAHTjFuqhA52fmfJ_j5iFk5PsfXaU'
}

export const socialLoginUrls = {
    google: `${apis.baseUrl}/public/login/google`,
    facebook: `${apis.baseUrl}/public/login/facebook`
}

export const appURL = 'https://camper.omairusaf.com'

