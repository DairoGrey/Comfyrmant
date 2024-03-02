import { all, call, spawn } from 'redux-saga/effects';

import { apiSaga } from '_state/features/api/saga';
import { blobsSaga } from '_state/features/blobs/saga';
import { hubSaga } from '_state/features/hub/saga';
import { notificationsSaga } from '_state/features/notifications/saga';
import { settingsSaga } from '_state/features/settings/saga';
import { workflowSaga } from '_state/features/workflow/saga';
import { workspacesSaga } from '_state/features/workspaces/saga';

export function* rootSaga() {
  const sagas: (() => Generator<never, void, unknown>)[] = [
    apiSaga,
    blobsSaga,
    // @ts-expect-error return type
    hubSaga,
    notificationsSaga,
    settingsSaga,
    // @ts-expect-error return type
    workflowSaga,
    workspacesSaga,
  ];

  yield all(
    sagas.map((saga) =>
      spawn(function* () {
        while (true) {
          try {
            yield call(saga);
            break;
          } catch (e) {
            console.log(e);
          }
        }
      }),
    ),
  );
}
