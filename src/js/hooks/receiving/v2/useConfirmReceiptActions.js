import { useEffect, useRef, useState } from 'react';

import _ from 'lodash';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getUsers } from 'selectors';

import receivingApi from 'api/services/ReceivingApi';
import { createNormalizedState } from 'utils/normalizationUtils';
import {
  receiptGroupForView,
  transformReceiptSummary,
} from 'utils/receiving/receiptSummaryRows';

const useConfirmReceiptActions = (view) => {
  const [loading, setLoading] = useState(false);
  const receiptIdRef = useRef(null);
  const [lineItemsState, setLineItemsState] = useState(createNormalizedState());
  const { shipmentId } = useParams();
  const users = useSelector(getUsers);

  const loadSummary = async () => {
    setLoading(true);
    try {
      const { data: { data: summary } } = await receivingApi.getReceiptSummary(shipmentId, {
        group: receiptGroupForView(view),
      });
      receiptIdRef.current = summary?.pendingReceiptId ?? null;
      setLineItemsState(transformReceiptSummary(summary, view, _.keyBy(users, 'id')));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!shipmentId) {
      return;
    }
    loadSummary();
  }, [shipmentId, view]);

  return {
    loading,
    receiptIdRef,
    lineItemsState,
  };
};

export default useConfirmReceiptActions;
