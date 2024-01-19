import Image from "next/image";


export function GridTileImage({
    isInteractive = true,
    active,
    label,
    ...props
  }: {
    isInteractive?: boolean;
    active?: boolean;
    label?: {
      title: string;
      amount: string;
      position?: 'bottom' | 'center';
    };
  } & React.ComponentProps<typeof Image>)
  
  {
    return(
        <div className={`group flex h-full w-full items-center justify-center overflow-hidden rounded-lg border hover:border-blue-600 bg-black ${
            label ? 'relative' : ''
          } ${
            active ? 'border-2 border-blue-600' : 'border-neutral-800'
          }`}>
             {props.src ? (
        // eslint-disable-next-line jsx-a11y/alt-text -- `alt` is inherited from `props`, which is being enforced with TypeScript
        <Image
        className={`relative h-full w-full object-contain ${
            isInteractive ? 'transition duration-300 ease-in-out group-hover:scale-105' : ''
          }`}
        {...props}
         />
      ) : null}

      <div
      className={`self-end left-0 flex w-full px-4 pb-4`}
      >
      <div className="flex items-center rounded-full border p-1 text-xs font-semibold backdrop-blur-md border-neutral-800 bg-black/70 text-white">
        <h3 className="mr-4 line-clamp-2 flex-grow pl-2 leading-none tracking-tight">{label?.title}</h3>
        <h3
          className="flex-none rounded-full bg-blue-600 p-2 text-white"
        >${label?.amount} USD</h3>
      </div>
    </div>
        </div>
);
}