declare var admin: FirebaseAdminNS.Admin;

declare namespace FirebaseAdminNS {
    export interface Admin {
        initializeApp(options: any, name?: string): any;
        credential: any;
    }
}

declare module 'firebase-admin' {
    export = admin;
}