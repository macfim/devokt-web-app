export interface INewClient {
  nom: string;
  prenom: string;
  tel: string;
}

export interface IRows {
  id: number;
  nom: string;
  prenom: string;
  tel: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface IClient {
  id: number;
  attributes: {
    nom: string;
    prenom: string;
    tel: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

export interface IData {
  data: IClient[];
  meta: {};
}

export enum EAlertStatus {
  success = "success",
  error = "error",
}

export interface IAlert {
  id: number;
  content: string;
  status: EAlertStatus;
}
