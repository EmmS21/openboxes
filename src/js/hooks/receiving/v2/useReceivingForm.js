import { useCallback } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { getReceivingPutawayEnabled, getReceivingView } from 'selectors';

import { updateReceivingPutawayEnabled, updateReceivingView } from 'actions';
import useCommentModal from 'hooks/receiving/v2/useCommentModal';
import useReceivingActions from 'hooks/receiving/v2/useReceivingActions';
import useReceivingBinLocations from 'hooks/receiving/v2/useReceivingBinLocations';
import useReceivingColumns from 'hooks/receiving/v2/useReceivingColumns';
import useTableLocationAutofill from 'hooks/receiving/v2/useTableLocationAutofill';

const useReceivingForm = () => {
  const dispatch = useDispatch();
  // The selected view is shared through redux, so the check step renders in the
  // view chosen here.
  const view = useSelector(getReceivingView);
  const setView = useCallback((newView) => dispatch(updateReceivingView(newView)), [dispatch]);
  const {
    loading,
    receiptId,
    lineItemsState,
    updateLineItem,
    updateLineItems,
    autofillQuantities,
    removeSplitItem,
    loadReceipt,
    onSaveAndExit,
    flush,
    autosaveStatus,
  } = useReceivingActions(view);
  // The putaway toggle is remembered per receiving in redux, keyed by receipt id.
  const putawayEnabled = useSelector((state) => getReceivingPutawayEnabled(state, receiptId));
  const setPutawayEnabled = useCallback((enabled) => {
    if (!receiptId) {
      return;
    }
    dispatch(updateReceivingPutawayEnabled(receiptId, enabled));
  }, [dispatch, receiptId]);
  useReceivingBinLocations();
  const { onLocationAutofill } = useTableLocationAutofill({
    lineItemsState,
    updateLineItems,
  });
  const { columns } = useReceivingColumns({ view, putawayEnabled });
  const commentModal = useCommentModal();
  return {
    view,
    setView,
    putawayEnabled,
    setPutawayEnabled,
    table: {
      lineItemsState,
      columns,
    },
    actions: {
      loading,
      receiptId,
      updateLineItem,
      autofillQuantities,
      removeSplitItem,
      loadReceipt,
      onSaveAndExit,
      flush,
      onLocationAutofill,
      autosaveStatus,
    },
    commentModal,
  };
};

export default useReceivingForm;
