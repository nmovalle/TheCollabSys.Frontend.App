export interface Role {
    id: string;
    name: string;
    normalizedName: string;
}

export interface ProposalRole {
    proposalId: number;
    proposaleRoles: string;
    roleId: string;
    proposaleName: string;
    description: string;
}