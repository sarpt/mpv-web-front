export type Entry = {
	Path: string,
	PlaybackTimestamp: number,
	AudioID: string,
	SubtitleID: string
};

export type Playlist = {
    CurrentEntryIdx: number,
    DirectoryContentsAsEntries: boolean,
    Entries: Entry,
    Name: string,
    Description: string,
	Path: string,
	UUID: string,
};

export type PlaylistsMap = { [key in string]: Playlist };
