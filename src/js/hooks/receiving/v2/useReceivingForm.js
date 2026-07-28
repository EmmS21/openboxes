import {
  useCallback, useEffect, useRef, useState,
} from 'react';

import { ReceivingView } from 'consts/receivingViewOptions';
import useCommentModal from 'hooks/receiving/v2/useCommentModal';
import useReceivingActions from 'hooks/receiving/v2/useReceivingActions';
import useReceivingBinLocations from 'hooks/receiving/v2/useReceivingBinLocations';
import useReceivingColumns from 'hooks/receiving/v2/useReceivingColumns';
import useReceivingFilters from 'hooks/receiving/v2/useReceivingFilters';
import useTableLocationAutofill from 'hooks/receiving/v2/useTableLocationAutofill';
import useTableSorting from 'hooks/useTableSorting';

const useReceivingForm = () => {
  const [view, setView] = useState(ReceivingView.TABLE);
  const [putawayEnabled, setPutawayEnabled] = useState(false);
  const {
    sortableProps, sort, order, resetSort,
  } = useTableSorting();
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
  } = useReceivingActions({ view, sort, sortOrder: order });
  useReceivingBinLocations();
  const { visibleLineItemsState, updateFilterParams } = useReceivingFilters({ lineItemsState });
  const { onLocationAutofill } = useTableLocationAutofill({
    lineItemsState: visibleLineItemsState,
    updateLineItems,
  });
  const autofillVisibleQuantities = useCallback(
    () => autofillQuantities(visibleLineItemsState),
    [autofillQuantities, visibleLineItemsState],
  );
  const commentModal = useCommentModal();
  // Auto-enable once when a reopened receipt has at least one row with a saved bin location,
  // so the column is visible.
  const putawayInitialized = useRef(false);
  useEffect(() => {
    if (putawayInitialized.current || !lineItemsState?.ids?.length) {
      return;
    }
    putawayInitialized.current = true;
    if (Object.values(lineItemsState.entities).some((item) => item?.binLocation)) {
      setPutawayEnabled(true);
    }
  }, [lineItemsState]);
  const { columns } = useReceivingColumns({
    view,
    putawayEnabled,
    sortableProps,
    sort,
    order,
  });

  return {
    view,
    setView,
    putawayEnabled,
    setPutawayEnabled,
    table: {
      lineItemsState: visibleLineItemsState,
      columns,
      sort,
      order,
    },
    actions: {
      loading,
      receiptId,
      updateLineItem,
      autofillQuantities: autofillVisibleQuantities,
      removeSplitItem,
      loadReceipt,
      onSaveAndExit,
      flush,
      onLocationAutofill,
      autosaveStatus,
      resetSort,
      updateFilterParams,
    },
    commentModal,
  };
};

export default useReceivingForm;
