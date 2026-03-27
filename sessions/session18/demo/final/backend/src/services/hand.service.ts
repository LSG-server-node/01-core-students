import { httpStatus } from '../config/httpStatusCodes';
import logger from '../config/logger';
import { AppError } from '../utils/application.error';
import {
  LowerHandInput,
  RaiseHandInput,
  RaisedHand,
} from '../interfaces/hand.interface';

const raisedHands: RaisedHand[] = [];

export class HandService {
  getAll = (): RaisedHand[] => {
    return [...raisedHands].sort(
      (left, right) => right.updatedAt.getTime() - left.updatedAt.getTime()
    );
  };

  raise = (input: RaiseHandInput): RaisedHand => {
    const userId = input.userId.trim();
    const name = input.name.trim();

    if (!userId || !name) {
      throw new AppError(
        'Both userId and name are required',
        httpStatus.BAD_REQUEST
      );
    }

    const hand: RaisedHand = {
      userId,
      name,
      raised: true,
      updatedAt: new Date(),
    };

    const existingHandIndex = raisedHands.findIndex(
      (currentHand) => currentHand.userId === userId
    );

    if (existingHandIndex >= 0) {
      raisedHands[existingHandIndex] = hand;
    } else {
      raisedHands.push(hand);
    }

    logger.info({ userId, name }, 'Service: Raising hand');
    return hand;
  };

  lower = (input: LowerHandInput): RaisedHand => {
    const userId = input.userId.trim();
    if (!userId) {
      throw new AppError('userId is required', httpStatus.BAD_REQUEST);
    }

    const currentHandIndex = raisedHands.findIndex(
      (hand) => hand.userId === userId
    );
    const currentHand =
      currentHandIndex >= 0 ? raisedHands[currentHandIndex] : null;
    const hand = currentHand
      ? {
          ...currentHand,
          raised: false,
          updatedAt: new Date(),
        }
      : null;

    if (!hand) {
      throw new AppError('Raised hand not found', httpStatus.NOT_FOUND, {
        userId,
      });
    }

    raisedHands.splice(currentHandIndex, 1);
    logger.info({ userId }, 'Service: Lowering hand');
    return hand;
  };
}
