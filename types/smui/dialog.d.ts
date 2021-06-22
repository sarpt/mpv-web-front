declare module '@smui/dialog/styled' {
  export default class Dialog {
    $$prop_def: any;
    $on:  any;
    
    open: () => void;
    close: () => void;
    isOpen: () => boolean;
  }

  export class Title {
    $$prop_def: any;
  }

  export class Content {
    $$prop_def: any;
  }

  export class Actions {
    $$prop_def: any;
  }

  export class InitialFocus {
    $$prop_def: any;
  }

  export type DialogClosedEvent = {
    detail: {
      action: string,
    },
  };
} 
