import { Container, token, createResolve } from "@owja/ioc";
import { MediaFilesRepository } from "./gateways/interfaces";
import { FetchMediaFilesUC } from "./usecases/fetchMediaFiles";

export const Dependencies = {
  "FetchMediaFilesUC": token<FetchMediaFilesUC>("FetchMediaFilesUC"),
  "MediaFilesRepository": token<MediaFilesRepository>("MediaFilesRepository")
}

export const container = new Container();
export const resolve = createResolve(container);
