import { all, call, put, select, takeEvery } from 'redux-saga/effects';

import { SUBMIT_SENDS, sendBoulders, toggleLoading, showError, rollback } from './actions';
import { getSendSubmitStates } from './selectors';
import { firestore as db } from './firebase';
import { createSends } from './send';
import * as sendMapUtils from './send-map';
import * as sendListUtils from './send-list';

const docRef = (collection, docId) => db.collection(collection).doc(docId);

function* submitSends({ payload: { type } }) {
  const { color, sectorIds, sendMap, sendList, signedInUser } = yield select(getSendSubmitStates);
  const sends = createSends({ color, type, sectorIds, userId: signedInUser.uid });

  if (signedInUser) {
    yield put(sendBoulders(sends));
    yield put(toggleLoading(true));

    const sendMapDiff = sendMapUtils.addAll(sendMapUtils.empty, sends);
    const sendListDiff = sendListUtils.addAllDiff(sendList, sends);

    const { uid } = signedInUser;
    // TODO: Make this a transaction once https://github.com/prescottprue/redux-firestore/issues/108 is fixed
    try {
      yield all([
        ...sends.map(send => call([docRef('sends', send.id), 'set'], send)),
        call([docRef('sendMaps', uid), 'set'], sendMapDiff, { merge: true }),
        call([docRef('sendLists', uid), 'set'], sendListDiff, { merge: true }),
      ]);
    } catch (error) {
      yield put(rollback({ sendMap, sendList, error }));
    }
    yield put(toggleLoading(false));
  } else {
    yield put(sendBoulders(sends));
    yield put(showError("Vous n'êtes pas connecté, les changements ne seront pas sauvegardés.", { ignoreId: 'loggedOutChanges' }));
  }
}

function* rootSaga() {
  yield all([
    takeEvery(SUBMIT_SENDS, submitSends),
  ]);
}

export default rootSaga;