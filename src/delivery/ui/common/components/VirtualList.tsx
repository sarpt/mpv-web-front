import { useVirtualizer } from "@tanstack/react-virtual";
import { ReactElement, useRef } from "react";

type Props<T> = {
  data: T[],
  width: number,
  height: number,
  rowSize: number,
  entryRenderer: (props: { entry: T, idx: number }) => ReactElement
};

export function VirtualList<T>({ data, height, rowSize, entryRenderer }: Props<T>) {
  const parentRef = useRef<HTMLDivElement | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowSize,
  });

  return (
    <>
      <div
        ref={parentRef}
        style={{
          height: `${height}px`,
          overflow: 'auto',
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: `100%`,
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const itemIdx = virtualItem.index;

            return (
              <div
                key={virtualItem.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                {
                  entryRenderer({ entry: data[itemIdx], idx: itemIdx })
                }
              </div>
            );
          })}
        </div>
      </div>
    </>
  )
};
