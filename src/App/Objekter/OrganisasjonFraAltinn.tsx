export interface Organisasjon {
    Name: string;
    Type: string;
    OrganizationNumber: string;
    OrganizationForm: string;
    Status: string;
    ParentOrganizationNumber: any;
}

export interface OrganisasjonlowerCase {
    name: string;
    type: string;
    organizationNumber: string;
    organizationForm: string;
    status: string;
    parentOrganizationNumber: any;
}

export const tomaAltinnOrganisasjon: Organisasjon = {
    Name: '',
    Type: '',
    OrganizationNumber: '',
    OrganizationForm: '',
    Status: '',
    ParentOrganizationNumber: ''
};
