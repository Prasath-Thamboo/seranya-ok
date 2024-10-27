"use client";

import axios from 'axios';
import { useTable, useGlobalFilter, useSortBy, usePagination, Column } from 'react-table';
import { useMemo, useCallback, useState } from 'react';
import {
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaSortUp,
  FaSortDown,
  FaEdit,
  FaEye,
  FaTrash,
  FaPlus,
  FaCheck,
  FaChevronDown,
} from 'react-icons/fa';
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
    <div className={`flex bg-gray-50 items-center p-2 gap-3 rounded-full border border-gray-900/10 ${className}`}>
      {decoration}
      <input
        id={name}
        name={name}
        value={value}
        type={type}
        placeholder={label}
        aria-label={label}
        onChange={onChange}
        className={`bg-gray-50 outline-none block font-kanit placeholder:font-kanit rounded-full w-full ${disabled ? 'bg-gray-200' : ''} ${inputClassName}`}
        disabled={disabled}
      />
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
      label="Recherche..."
      decoration={<FaSearch className="h-5 w-5 text-gray-400" />}
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
        className={`relative w-full rounded-full py-3 px-4 text-base text-gray-700 text-left shadow-sm focus:outline-none ${disabled ? 'bg-gray-200 cursor-not-allowed' : 'bg-white cursor-default'}`}
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span className="block truncate font-kanit">{selectedOption?.caption}</span>
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
              <span className={`block truncate ${option.id === value ? 'font-medium' : 'font-normal'} text-black font-kanit`}>
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
  className?: string;
}

function Button2({ content, onClick, active, disabled, className = '' }: Button2Props) {
  return (
    <button
      className={`flex items-center justify-center px-4 py-2 rounded-full shadow-md hover:shadow-teal-500/50 transform transition-transform duration-300 hover:scale-105 font-kanit uppercase ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
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
  pageOptions: number[];
  pageSize: number;
  totalItems: number;
}

function PaginationNav1({ gotoPage, canPreviousPage, canNextPage, pageCount, pageIndex, pageOptions, pageSize, totalItems }: PaginationNav1Props) {
  const startItem = pageIndex * pageSize + 1;
  const endItem = Math.min((pageIndex + 1) * pageSize, totalItems);

  return (
    <div className="flex justify-between items-center mt-4">
      <div>
        <Button2
          content={<><FaChevronLeft /> Précédent</>}
          onClick={() => gotoPage(pageIndex - 1)}
          disabled={!canPreviousPage}
          className="bg-teal-500 text-white hover:bg-teal-600"
        />
      </div>
      <div className="text-sm text-gray-700 font-kanit">
        Page {pageIndex + 1} sur {pageCount}
      </div>
      <div>
        <Button2
          content={<>Suivant <FaChevronRight /></>}
          onClick={() => gotoPage(pageIndex + 1)}
          disabled={!canNextPage}
          className="bg-teal-500 text-white hover:bg-teal-600"
        />
      </div>
    </div>
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
          className="bg-teal-500 text-white px-4 py-2 rounded-full flex items-center gap-2 font-kanit hover:bg-teal-600 hover:shadow-teal-500/50 transition"
          onClick={() => window.location.href = viewUrl}
        >
          <FaEye /> Voir
        </button>
      )}
      {editUrl && (
        <button
          className="bg-teal-500 text-white px-4 py-2 rounded-full flex items-center gap-2 font-kanit hover:bg-teal-600 hover:shadow-teal-500/50 transition"
          onClick={() => window.location.href = editUrl}
        >
          <FaEdit /> Modifier
        </button>
      )}
      {onDelete && (
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-full flex items-center gap-2 font-kanit hover:bg-red-600 hover:shadow-red-500/50 transition"
          onClick={onDelete}
        >
          <FaTrash /> Supprimer
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
        addNotification("success", `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} supprimé(e) avec succès.`);
      } catch (error) {
        console.error('Erreur lors de la suppression :', error);
        addNotification("critical", `Erreur lors de la suppression de la ${itemType}.`);
      } finally {
        setDeleteModalVisible(false);
      }
    }
  };

  return (
    <div className="mt-6 shadow-sm border rounded-lg overflow-x-auto">
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
        <table {...getTableProps()} className="w-full table-auto text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b">
            {headerGroups.map((headerGroup: any) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map((column: any) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="py-3 px-6 font-iceberg cursor-pointer"
                    style={{ width: column.width }}
                    key={column.id}
                  >
                    {column.render('Header')}
                  </th>
                ))}
                <th
                  className="py-3 px-6 font-iceberg"
                  key="actions"
                >
                  Actions
                </th>
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="text-gray-600 divide-y">
            {rows.map((row: any) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={row.id} className="hover:bg-gray-100">
                  {row.cells.map((cell: any) => (
                    <td
                      {...cell.getCellProps()}
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap font-kanit"
                    >
                      {cell.render('Cell')}
                    </td>
                  ))}
                  <td
                    className="px-6 py-4 whitespace-nowrap"
                    key={`actions-${row.id}`}
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
    pageOptions,
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
    <div className="flex flex-col gap-4 font-kanit w-full">
      <div className="container mx-auto py-6 sm:px-6">
        <div className="px-4 py-4 -mx-4 sm:-mx-6 sm:px-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold leading-tight font-iceberg">
              Liste des {itemType.charAt(0).toUpperCase() + itemType.slice(1)}s
            </h2>
            <div className="flex items-center gap-3">
              <GlobalSearchFilter1 className="sm:w-64" globalFilter={state.globalFilter} setGlobalFilter={setGlobalFilter} />
              {createUrl && (
                <button
                  className="bg-teal-500 text-white px-5 py-2 rounded-full shadow-md hover:shadow-teal-500/50 transform transition-transform duration-300 hover:scale-105 font-kanit flex items-center gap-2"
                  onClick={() => window.location.href = createUrl}
                >
                  <FaPlus /> {createButtonText}
                </button>
              )}
            </div>
          </div>
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
      <PaginationNav1
        gotoPage={gotoPage}
        canPreviousPage={canPreviousPage}
        canNextPage={canNextPage}
        pageCount={pageCount}
        pageIndex={pageIndex}
        pageOptions={pageOptions}
        pageSize={pageSize}
        totalItems={data.length}
      />
    </div>
  );
}

export default Table;
