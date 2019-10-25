import styled from 'styled-components';
import { DataTable } from 'grommet';

export const DataTableWithDynamicHeight = styled(DataTable).attrs(props => ({
  size: props.size || 'calc(100vh - 280px)',
}))`
  tbody {
    // 2 rows
    min-height: 72px;
    max-height: ${props => props.size};
  }
`;
