"use client";

import axios from 'axios';
import { useTable, useGlobalFilter, useSortBy, usePagination, Column } from 'react-table';
import { useMemo, useCallback, useState } from 'react';
import { FaSearch, FaChevronDown, FaCheck, FaChevronLeft, FaChevronRight, FaSortUp, FaSortDown, FaEdit, FaEye, FaTrash, FaPlus, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import { Image } from 'antd';
import Badge from './Badge';
import CustomModal from './CustomModal';
import { useNotification } from '@/components/notifications/NotificationProvider';

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URL_PROD
    : process.env.NEXT_PUBLIC_API_URL_LOCAL || 'http://localhost:5000';

interface AvatarProps {
  src: string;
  alt?: string;
}

function Avatar({ src, alt = 'avatar' }: AvatarProps) {
  return (
    <Image
      width={120}
      height={80}
      src={src}
      alt={alt}
      style={{ borderRadius: '8px', objectFit: 'cover' }}
      preview={true}
    />
  );
}

interface InputGroup7Props {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  decoration?: React.ReactNode;
  className?: string;
  inputClassName?: string;
  decorationClassName?: string;
  disabled?: boolean;
}

function InputGroup7({
  label,
  name,
  value,
  onChange,
  type = 'text',
  decoration,
  className = '',
  inputClassName = '',
  decorationClassName = '',
  disabled = false,
}: InputGroup7Props) {
  return (
    <div className={`flex flex-row-reverse items-stretch w-full rounded-xl overflow-hidden bg-white shadow-sm ${className}`}>
      <input
        id={name}
        name={name}
        value={value}
        type={type}
        placeholder={label}
        aria-label={label}
        onChange={onChange}
        className={`peer block w-full p-4 text-base text-gray-600 focus:outline-none focus:ring-0 appearance-none ${disabled ? 'bg-gray-200' : ''} ${inputClassName}`}
        disabled={disabled}
      />
      <div className={`flex items-center pl-4 py-4 text-gray-600 ${disabled ? 'bg-gray-200' : ''} ${decorationClassName}`}>
        {decoration}
      </div>
    </div>
  );
}

interface GlobalSearchFilter1Props {
  globalFilter: string;
  setGlobalFilter: (filterValue: string) => void;
  className?: string;
}

function GlobalSearchFilter1({ globalFilter, setGlobalFilter, className = '' }: GlobalSearchFilter1Props) {
  return (
    <InputGroup7
      name="search"
      value={globalFilter || ''}
      onChange={(e) => setGlobalFilter(e.target.value)}
      label="Recherche"
      decoration={<FaSearch size="1.25rem" className="text-gray-400" />}
      className={className}
    />
  );
}

interface Option {
  id: number;
  caption: string;
}

interface SelectMenu1Props {
  value: number;
  setValue: (value: number) => void;
  options: Option[];
  className?: string;
  disabled?: boolean;
}

function SelectMenu1({ value, setValue, options, className = '', disabled = false }: SelectMenu1Props) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = useMemo(() => options.find((o) => o.id === value), [options, value]);

  return (
    <div className={`relative w-full ${className}`}>
      <button
        className={`relative w-full rounded-xl py-4 pl-4 pr-10 text-base text-gray-700 text-left shadow-sm focus:outline-none ${disabled ? 'bg-gray-200 cursor-not-allowed' : 'bg-white cursor-default'}`}
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span className="block truncate">{selectedOption?.caption}</span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <FaChevronDown size="1rem" className="text-gray-400" aria-hidden="true" />
        </span>
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white text-base shadow-sm focus:outline-none">
          {options.map((option) => (
            <div
              key={option.id}
              className={`relative cursor-pointer select-none py-4 pl-10 pr-4 ${option.id === value ? 'bg-gray-100' : ''}`}
              onClick={() => {
                setValue(option.id);
                setIsOpen(false);
              }}
            >
              <span className={`block truncate ${option.id === value ? 'font-medium' : 'font-normal'} text-black`}>
                {option.caption}
              </span>
              {option.id === value && (
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-black">
                  <FaCheck size="0.75rem" aria-hidden="true" />
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface Button2Props {
  content: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}

function Button2({ content, onClick, active, disabled }: Button2Props) {
  return (
    <button
      className={`flex cursor-pointer items-center justify-center w-10 h-10 rounded-full text-base text-gray-700 shadow-sm focus:outline-none hover:bg-black hover:text-white ${active ? 'bg-black text-white' : 'bg-white text-black'}`}
      onClick={onClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
}

interface PaginationNav1Props {
  gotoPage: (page: number) => void;
  canPreviousPage: boolean;
  canNextPage: boolean;
  pageCount: number;
  pageIndex: number;
}

function PaginationNav1({ gotoPage, canPreviousPage, canNextPage, pageCount, pageIndex }: PaginationNav1Props) {
  const renderPageLinks = useCallback(() => {
    if (pageCount === 0) return null;
    const visiblePageButtonCount = 3;
    let numberOfButtons = pageCount < visiblePageButtonCount ? pageCount : visiblePageButtonCount;
    const pageIndices = [pageIndex];
    numberOfButtons--;
    [...Array(numberOfButtons)].forEach((_item, itemIndex) => {
      const pageNumberBefore = pageIndices[0] - 1;
      const pageNumberAfter = pageIndices[pageIndices.length - 1] + 1;
      if (pageNumberBefore >= 0 && (itemIndex < numberOfButtons / 2 || pageNumberAfter > pageCount - 1)) {
        pageIndices.unshift(pageNumberBefore);
      } else {
        pageIndices.push(pageNumberAfter);
      }
    });
    return pageIndices.map((pageIndexToMap) => (
      <li key={pageIndexToMap}>
        <Button2 content={pageIndexToMap + 1} onClick={() => gotoPage(pageIndexToMap)} active={pageIndex === pageIndexToMap} disabled={false} />
      </li>
    ));
  }, [pageCount, pageIndex, gotoPage]);

  return (
    <ul className="flex gap-2 items-center">
      <li>
        <Button2 content={<FaAngleDoubleLeft />} onClick={() => gotoPage(0)} disabled={!canPreviousPage} active={false} />
      </li>
      <li>
        <Button2 content={<FaChevronLeft />} onClick={() => gotoPage(pageIndex - 1)} disabled={!canPreviousPage} active={false} />
      </li>
      {renderPageLinks()}
      <li>
        <Button2 content={<FaChevronRight />} onClick={() => gotoPage(pageIndex + 1)} disabled={!canNextPage} active={false} />
      </li>
      <li>
        <Button2 content={<FaAngleDoubleRight />} onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} active={false} />
      </li>
    </ul>
  );
}

interface ActionButtonProps {
  viewUrl?: string;
  editUrl?: string;
  onDelete?: () => void;
}

function ActionButtons({ viewUrl, editUrl, onDelete }: ActionButtonProps) {
  return (
    <div className="flex gap-2 justify-center">
      {viewUrl && (
        <button
          className="bg-black text-white p-2 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-transform transform hover:scale-110 hover:border"
          onClick={() => window.location.href = viewUrl}
        >
          <FaEye className='h-5 w-5' />
        </button>
      )}
      {editUrl && (
        <button
          className="bg-black text-white p-2 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-transform transform hover:scale-110 hover:border"
          onClick={() => window.location.href = editUrl}
        >
          <FaEdit className='h-4 w-4' />
        </button>
      )}
      {onDelete && (
        <button
          className="bg-red-500 text-white p-2 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-transform transform hover:scale-110 hover:border hover:border-red"
          onClick={onDelete}
        >
          <FaTrash className='h-4 w-4' />
        </button>
      )}
    </div>
  );
}

interface TableComponentProps {
  getTableProps: () => any;
  headerGroups: any;
  getTableBodyProps: () => any;
  rows: any[];
  prepareRow: (row: any) => void;
  onDelete: (item: any) => void;
  baseRoute: string;
  apiRoute: string;
  itemType: string;
}

function TableComponent({ getTableProps, headerGroups, getTableBodyProps, rows, prepareRow, onDelete, baseRoute, apiRoute, itemType }: TableComponentProps) {
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const { addNotification } = useNotification();

  const handleDelete = (row: any) => {
    setItemToDelete(row.original);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          throw new Error("Token non trouvé");
        }
        await axios.delete(`${BASE_URL}/${apiRoute}/${itemToDelete.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        onDelete(itemToDelete);
        addNotification("success", `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} supprimée avec succès.`);
      } catch (error) {
        console.error('Erreur lors de la suppression :', error);
        addNotification("critical", `Erreur lors de la suppression de la ${itemType}.`);
      } finally {
        setDeleteModalVisible(false);
      }
    }
  };

  return (
    <div className="w-full overflow-x-auto bg-white rounded-xl shadow-sm max-w-full px-4">
      <CustomModal
        visible={isDeleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={confirmDelete}
        title={`Supprimer ${itemType}`}
        subtitle={`Êtes-vous sûr de vouloir supprimer cette ${itemType} ? Cette action est irréversible.`}
        confirmText="Confirmer"
        cancelText="Annuler"
        iconType="delete"
      />
      <div className="relative inline-block min-w-full">
        <table {...getTableProps()} className="min-w-full table-auto">
          <thead>
            {headerGroups.map((headerGroup: any) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map((column: any) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="px-3 py-2 text-start text-sm font-medium uppercase cursor-pointer whitespace-nowrap"
                    style={{ width: column.width }}
                    key={column.id}
                  >
                    <div className="flex gap-2 items-center">
                      <div className="text-gray-600">{column.render('Header')}</div>
                      <div className="flex flex-col">
                        <FaSortUp
                          className={`text-base translate-y-1/2 ${column.isSorted && !column.isSortedDesc ? 'text-black' : 'text-gray-300'}`}
                        />
                        <FaSortDown
                          className={`text-base -translate-y-1/2 ${column.isSortedDesc ? 'text-black' : 'text-gray-300'}`}
                        />
                      </div>
                    </div>
                  </th>
                ))}
                {/* Modification de la colonne "Actions" */}
                <th
                  className="sticky right-0 bg-black/80 px-3 py-2 text-start text-sm font-medium uppercase cursor-pointer whitespace-nowrap text-white"
                  style={{ boxShadow: 'inset 5px 0 5px -5px rgba(0,0,0,0.5)' }} // Ombre gauche personnalisée
                >
                  Actions
                </th>
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row: any) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={row.id} className="hover:bg-gray-100">
                  {row.cells.map((cell: any) => (
                    <td
                      {...cell.getCellProps()}
                      key={cell.id}
                      className={`px-3 py-2 text-sm font-normal text-gray-700 whitespace-nowrap first:rounded-l-lg last:rounded-r-lg max-w-xs overflow-hidden text-ellipsis`}
                      // Les cellules autres que "Actions" peuvent garder leur style
                    >
                      {cell.column.id === 'story' || cell.column.id === 'bio' ? (
                        <div title={cell.value}>
                          {cell.value.length > 30 ? `${cell.value.slice(0, 30)}...` : cell.value}
                        </div>
                      ) : cell.column.id === 'type' ? (
                        <Badge type={cell.value} />
                      ) : (
                        cell.render('Cell')
                      )}
                    </td>
                  ))}
                  {/* Modification de la cellule "Actions" */}
                  <td
                    className="sticky right-0 bg-black/80 px-3 py-2 text-sm font-normal text-white whitespace-nowrap flex items-center justify-center shadow-inset-left h-full"
                    style={{ boxShadow: 'inset 5px 0 5px -5px rgba(0,0,0,0.5)' }} // Ombre gauche personnalisée
                  >
                    <ActionButtons
                      viewUrl={`/${baseRoute}/${row.original.id}`}
                      editUrl={`/${baseRoute}/update?id=${row.original.id}`}
                      onDelete={() => handleDelete(row)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface TableProps {
  data: any[];
  columns: Column<any>[];
  createButtonText?: string;
  createUrl?: string;
  onDelete: (item: any) => void;
  baseRoute: string; // Pour les routes côté client
  apiRoute: string;  // Pour les appels à l'API
  itemType: string;  // Pour personnaliser les textes (e.g., 'classe')
}

function Table({ data, columns, createButtonText, createUrl, onDelete, baseRoute, apiRoute, itemType }: TableProps) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    state,
    setGlobalFilter,
    page: rows,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 5 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  return (
    <div className="flex flex-col gap-4 font-kanit w-11/12">
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <GlobalSearchFilter1 className="sm:w-64" globalFilter={state.globalFilter} setGlobalFilter={setGlobalFilter} />
        <div className="flex gap-2 items-center sm:w-auto">
          {createUrl && (
            <button
              className="flex items-center justify-center rounded-xl py-3 px-5 text-lg text-gray-700 shadow-sm focus:outline-none hover:bg-black hover:text-white bg-white text-black sm:w-auto min-w-[240px]"
              onClick={() => window.location.href = createUrl}
            >
              <FaPlus className="mr-2" />
              <span className="uppercase">{createButtonText}</span>
            </button>
          )}
          <SelectMenu1 value={pageSize} setValue={setPageSize} options={[
            { id: 5, caption: '5 éléments par page' },
            { id: 10, caption: '10 éléments par page' },
            { id: 20, caption: '20 éléments par page' },
          ]} />
        </div>
      </div>
      <TableComponent
        getTableProps={getTableProps}
        headerGroups={headerGroups}
        getTableBodyProps={getTableBodyProps}
        rows={rows}
        prepareRow={prepareRow}
        onDelete={onDelete}
        baseRoute={baseRoute}
        apiRoute={apiRoute}
        itemType={itemType}
      />
      <div className="flex justify-center">
        <PaginationNav1 gotoPage={gotoPage} canPreviousPage={canPreviousPage} canNextPage={canNextPage} pageCount={pageCount} pageIndex={pageIndex} />
      </div>
    </div>
  );
}

export default Table;
