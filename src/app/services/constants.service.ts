import { Injectable } from '@angular/core'

@Injectable({
    providedIn: 'root'
})


export class ConstantsService {
    superAdminId = 1
    constructor(
    ) {
    }
    public static DEFAULT_COUNTRY_ID = 16

    public static USER_ROLES = {
        TENANT: 'tenant',
        LANDLORD: 'landlord',
        ADMIN: 'admin',
        
    }
    static DAYS = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ]

    public static STATUSES = {
        active: 'Active',
        inactive: 'InActive'
    }

    public LANGUAGES = {
        en: 'English',
        de: 'German',
        nl: 'Dutch',
        fr: 'French'
    }

    public DATE_TIME_FORMAT = {
        CHAR_DATE: 'MMM DD, YYYY',
        SHORT_DATE: 'DD-MM-YYYY',
        DATE: 'dddd, MMMM DD, YYYY',
        TIME: 'HH:mm',
        DATE_TIME: 'dddd, MMMM DD, YYYY hh:mm A',
        AM_PM: 'HH:mm A',
        DOC_DATE: 'DD MMM, YYYY',
        DATE_AMPM: 'DD MMM, YYYY, h a'
    }

    public static EDITOR_CONFIG = {
        editable: true,
        spellcheck: false,
        height: 'auto',
        minHeight: '500',
        maxHeight: 'auto',
        width: 'auto',
        minWidth: '0',
        translate: 'yes',
        enableToolbar: true,
        showToolbar: true,
        placeholder: 'Enter your Content Here',
        defaultParagraphSeparator: '',
        defaultFontName: 'calibri',
        defaultFontSize: '12',
        fonts: [
            { class: 'arial', name: 'Arial' },
            { class: 'times-new-roman', name: 'Times New Roman' },
            { class: 'calibri', name: 'Calibri' },
            { class: 'comic-sans-ms', name: 'Comic Sans MS' }
        ],
        // uploadUrl: 'v1/image',
        uploadWithCredentials: false,
        sanitize: true,
        toolbarPosition: 'top',
        toolbarHiddenButtons: [
            [
                'customClasses',
                'insertVideo',
                'insertHorizontalRule',
                'removeFormat',
                'fontName'
                // 'toggleEditorMode'
            ]
        ]
    }
}

