import styled from 'styled-components';

export const TableContainer = styled.div`
  position: relative;
  overflow-x: auto;
`;

export const StyledTable = styled.table`
  width: 100%;
  font-size: 0.875rem;
  text-align: left;
  color: #6B7280; /* gray-500 */
  direction: rtl;
  
  @media (prefers-color-scheme: dark) {
    color: #D1D5DB; /* gray-400 */
  }
`;

export const TableHeader = styled.thead`
  font-size: 0.75rem;
  color: #374151; /* gray-700 */
  background-color: #F9FAFB; /* gray-50 */

  @media (prefers-color-scheme: dark) {
    background-color: #374151; /* gray-700 */
    color: #D1D5DB; /* gray-400 */
  }
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid #E5E7EB; /* gray-200 */
  
  &:nth-child(even) {
    background-color: #F9FAFB; /* gray-50 */
  }

  @media (prefers-color-scheme: dark) {
    background-color: #1F2937; /* gray-800 */
    border-color: #374151; /* gray-700 */
  }
`;

export const TableHeaderCell = styled.th`
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  text-transform: uppercase;
`;

export const TableCell = styled.td`
  padding: 0.75rem 1.5rem;
`;

export const TableDataRow = styled.th`
  padding: 1rem 1.5rem;
  font-weight: 500;
  text-color: #111827; /* gray-900 */
  
  @media (prefers-color-scheme: dark) {
    color: white;
  }
`;