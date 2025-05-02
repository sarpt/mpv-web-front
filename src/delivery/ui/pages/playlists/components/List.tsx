import { useCallback } from "react";

import { EntryRendererProps, VirtualList } from "ui/common/components/VirtualList";
import { Item } from "./Item";
import { Playlist } from "src/domains/playlists/entities";

type Props = {
  currentPlaylist?: Playlist, 
  playlists: Playlist[],
  onPlaylistSelected: (playlist: Playlist) => void,
  width: number,
  height: number, 
};

const rowSize = 72;

export const List = ({ playlists, height, width, onPlaylistSelected, currentPlaylist }: Props) => {
  const entryRenderer = useCallback((props: EntryRendererProps<Playlist>) => {
    return <Item selected={currentPlaylist?.UUID === props.entry.UUID} {...props} />;
  }, [currentPlaylist?.UUID]);

  return (
    <VirtualList
      width={width}
      height={height}
      data={playlists}
      rowSize={rowSize}
      entryRenderer={entryRenderer}
      onSelected={onPlaylistSelected}
    />
  );
};
