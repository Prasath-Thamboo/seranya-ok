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
      width={80}
      height={56}
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
      decoration={<FaSearch className="h-5 w-5 text-gray-400 shrink-0" />}
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
  return (
    <div className="flex justify-between items-center mt-4 gap-2">
      <Button2
        content={
          <>
            <FaChevronLeft className="shrink-0" />
            <span className="hidden sm:inline ml-1">Précédent</span>
          </>
        }
        onClick={() => gotoPage(pageIndex - 1)}
        disabled={!canPreviousPage}
        className="bg-teal-500 text-white hover:bg-teal-600 text-sm"
      />
      <span className="text-sm text-gray-700 font-kanit whitespace-nowrap">
        {pageIndex + 1} / {pageCount}
      </span>
      <Button2
        content={
          <>
            <span className="hidden sm:inline mr-1">Suivant</span>
            <FaChevronRight className="shrink-0" />
          </>
        }
        onClick={() => gotoPage(pageIndex + 1)}
        disabled={!canNextPage}
        className="bg-teal-500 text-white hover:bg-teal-600 text-sm"
      />
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
    <div className="flex gap-1 items-center justify-center">
      {viewUrl && (
        <a
          href={viewUrl}
          title="Voir"
          className="p-2 rounded-lg text-teal-600 hover:bg-teal-50 transition-colors"
        >
          <FaEye className="w-4 h-4" />
        </a>
      )}
      {editUrl && (
        <a
          href={editUrl}
          title="Modifier"
          className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"
        >
          <FaEdit className="w-4 h-4" />
        </a>
      )}
      {onDelete && (
        <button
          title="Supprimer"
          onClick={onDelete}
          className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
        >
          <FaTrash className="w-4 h-4" />
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
        if (!token) throw new Error("Token non trouvé");
        await axios.delete(`${BASE_URL}/${apiRoute}/${itemToDelete.id}`, {
          headers: { Authorization: `Bearer ${token}` },
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
    <div className="mt-4 shadow-sm border rounded-xl overflow-hidden bg-white">
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

      {/* Vue tableau — masquée sur mobile */}
      <div className="hidden md:block overflow-x-auto">
        <table {...getTableProps()} className="w-full table-auto text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b">
            {headerGroups.map((headerGroup: any) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map((column: any) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="py-3 px-4 font-iceberg cursor-pointer whitespace-nowrap"
                    style={{ width: column.width }}
                    key={column.id}
                  >
                    {column.render('Header')}
                  </th>
                ))}
                <th className="py-3 px-4 font-iceberg text-center whitespace-nowrap" key="actions">
                  Actions
                </th>
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="text-gray-600 divide-y">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={999} className="px-4 py-8 text-center text-gray-400 font-kanit text-sm">
                  Aucun résultat.
                </td>
              </tr>
            ) : (
              rows.map((row: any) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} key={row.id} className="hover:bg-gray-50">
                    {row.cells.map((cell: any) => (
                      <td {...cell.getCellProps()} key={cell.id} className="px-4 py-3 font-kanit">
                        {cell.render('Cell')}
                      </td>
                    ))}
                    <td className="px-4 py-3" key={`actions-${row.id}`}>
                      <ActionButtons
                        viewUrl={`/${baseRoute}/${row.original.id}`}
                        editUrl={`/${baseRoute}/update?id=${row.original.id}`}
                        onDelete={() => handleDelete(row)}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Vue cartes — visible uniquement sur mobile */}
      <div className="block md:hidden divide-y">
        {rows.length === 0 ? (
          <p className="text-center text-gray-400 py-8 font-kanit text-sm">Aucun résultat.</p>
        ) : (
          rows.map((row: any) => {
            prepareRow(row);
            return (
              <div key={row.id} className="p-4 hover:bg-gray-50 transition-colors">
                {row.cells.map((cell: any) => (
                  <div key={cell.column.id} className="flex justify-between items-start py-1.5 gap-3 min-w-0">
                    <span className="text-gray-400 text-xs font-iceberg uppercase tracking-wider shrink-0">
                      {cell.column.render('Header')}
                    </span>
                    <div className="text-gray-700 font-kanit text-sm text-right min-w-0 max-w-[65%] break-words">
                      {cell.render('Cell')}
                    </div>
                  </div>
                ))}
                <div className="flex justify-end mt-3 pt-3 border-t border-gray-100">
                  <ActionButtons
                    viewUrl={`/${baseRoute}/${row.original.id}`}
                    editUrl={`/${baseRoute}/update?id=${row.original.id}`}
                    onDelete={() => handleDelete(row)}
                  />
                </div>
              </div>
            );
          })
        )}
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
  baseRoute: string;
  apiRoute: string;
  itemType: string;
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
      {/* Barre de contrôle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl font-semibold font-iceberg">
          Liste des {itemType.charAt(0).toUpperCase() + itemType.slice(1)}s
        </h2>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <GlobalSearchFilter1
            className="w-full sm:w-64"
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
          {createUrl && (
            <button
              className="bg-teal-500 text-white px-4 py-2 rounded-full shadow-md hover:shadow-teal-500/50 transform transition-transform duration-300 hover:scale-105 font-kanit flex items-center justify-center gap-2 whitespace-nowrap"
              onClick={() => window.location.href = createUrl}
            >
              <FaPlus /> {createButtonText}
            </button>
          )}
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
