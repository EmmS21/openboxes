import ReceivingRowType from 'consts/receivingRowType';

// Maps the normalized line items state into the rows consumed by DataTable, shared by
// the receiving and check step tables. Separators pass through without meta. Meta is
// only used to disable (grey out) fully received rows, and separators don't need disabling.
const buildReceivingTableRows = (lineItemsState) => {
  const { entities, ids } = lineItemsState;

  const buildRow = (rowId) => ({
    id: rowId,
    meta: {
      isRowDisabled: entities[rowId]?.isCompleted,
      label: 'react.receiving.fullyReceived.label',
      defaultMessage: 'This line has been fully received',
    },
  });

  // Split item rows, rendered by TanStack as subRows of their toggle row.
  // Split items of the same product merge into one visual block.
  const buildSubRow = (splitItemId, splitItemIndex, splitItemIds) => {
    const nextSplitItem = entities[splitItemIds[splitItemIndex + 1]];
    return {
      id: splitItemId,
      mergeWithNextRow: Boolean(nextSplitItem && !nextSplitItem.isFirstSplitItem),
      isLastSubRow: splitItemIndex === splitItemIds.length - 1,
    };
  };

  return ids
    // Split item rows render as subRows of their toggle row, not at the top level.
    .filter((entry) => entities[entry]?.rowType !== ReceivingRowType.SPLIT_ITEM)
    .map((entry) => {
      if (entry.isSeparator) {
        return entry;
      }
      return {
        ...buildRow(entry),
        subRows: entities[entry]?.splitItemIds?.map(buildSubRow),
        // A replaced row is always followed by its toggle row and merges with it.
        mergeWithNextRow: entities[entry]?.rowType === ReceivingRowType.REPLACED,
      };
    });
};

export default buildReceivingTableRows;
