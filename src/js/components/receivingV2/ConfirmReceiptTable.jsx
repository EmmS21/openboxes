import React, { useMemo } from 'react';

import PropTypes from 'prop-types';

import DataTable from 'components/DataTable/v2/DataTable';
import CommentModal from 'components/modals/CommentModal';
import buildReceivingTableRows from 'utils/receiving/buildReceivingTableRows';

import 'components/receivingV2/receiving.scss';

const ConfirmReceiptTable = ({
  lineItemsState,
  columns,
  loading,
  commentModal,
  cancelRemaining,
}) => {
  const {
    isOpen: isCommentModalOpen,
    openModal: openCommentModal,
    closeModal: closeCommentModal,
  } = commentModal;

  // Keep `meta` stable so it only changes when the entities map or the cancel remaining
  // selection change. Combined with the memoized cells, a single row update re-renders
  // just that row instead of the whole table.
  const meta = useMemo(
    () => ({
      entities: lineItemsState.entities,
      onOpenCommentModal: openCommentModal,
      cancelRemainingIds: cancelRemaining.ids,
      onToggleCancelRemaining: cancelRemaining.toggle,
    }),
    [
      lineItemsState.entities,
      openCommentModal,
      cancelRemaining.ids,
      cancelRemaining.toggle,
    ],
  );

  const data = useMemo(() => buildReceivingTableRows(lineItemsState), [lineItemsState]);

  return (
    <div className="receiving-table">
      <DataTable
        columns={columns}
        data={data}
        totalCount={data.length}
        meta={meta}
        disablePagination
        tableWithPinnedColumns
        loading={loading}
        loadingMessage={{
          id: 'react.default.loading.label',
          defaultMessage: 'Loading...',
        }}
        emptyTableMessage={{
          id: 'react.receiving.emptyTable.label',
          defaultMessage: 'No items to receive',
        }}
        virtualize={{
          enabled: true,
          minSize: 20,
          estimateSize: 72,
          overscan: 10,
          customRowsHeight: true,
        }}
        getSubRows={(row) => row.subRows}
        defaultExpandedSubRows
      />
      <CommentModal isOpen={isCommentModalOpen} onClose={closeCommentModal} />
    </div>
  );
};

ConfirmReceiptTable.propTypes = {
  lineItemsState: PropTypes.shape({
    entities: PropTypes.shape({}),
    ids: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      // Type for separator rows ({ isSeparator, name })
      PropTypes.shape({}),
    ])),
  }).isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  loading: PropTypes.bool.isRequired,
  commentModal: PropTypes.shape({
    isOpen: PropTypes.bool.isRequired,
    openModal: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
  }).isRequired,
  cancelRemaining: PropTypes.shape({
    ids: PropTypes.instanceOf(Set).isRequired,
    toggle: PropTypes.func.isRequired,
  }).isRequired,
};

export default ConfirmReceiptTable;
