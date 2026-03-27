export interface RaisedHand {
  userId: string;
  name: string;
  raised: boolean;
  updatedAt: Date;
}

export interface RaiseHandInput {
  userId: string;
  name: string;
}

export interface LowerHandInput {
  userId: string;
}
