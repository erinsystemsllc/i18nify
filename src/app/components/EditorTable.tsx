import React, { FunctionComponent, useEffect, useState } from 'react';
import { Button, Col, notification, Popconfirm, Row, Table } from 'antd';
import { TableRowItem } from './types';
import EditableRow from './EditableRow';
import EditableCell from './EditableCell';
import './editable-table.scss';
import axios from 'axios';

export interface EditorTableProps {
  data: TableRowItem[];
}

const components = {
  body: {
    row: EditableRow,
    cell: EditableCell,
  },
};

const EditorTable: FunctionComponent<EditorTableProps> = ({ data }) => {
  const [dataSource, setDatasource] = useState<TableRowItem[]>(data);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setDatasource(data);
  }, [data]);

  const handleDelete = (key: React.Key): void => {
    setDatasource(dataSource.filter((item) => item.key !== key));
  };

  const saveEntry = async (record: TableRowItem): Promise<void> => {
    setIsLoading(true);
    axios
      .post(`${process.env.NODE_BACKEND_URL}/replace`, {
        path: record.path,
        word: record.word,
        translation: record.translation,
        translationKey: record.translationKey,
      })
      .then((res) => {
        if (res.data.isReplaced) {
          setTimeout(() => {
            setIsLoading(false);
            notification.success({
              message: 'Success!',
              description: `The word: ${record.word} has been successfully replaced by the translation key ${record.translationKey}`,
            });
          }, 500);
        }
      });
  };

  const columns = [
    {
      title: 'File name',
      dataIndex: 'fileName',
      width: '15%',
    },
    {
      title: 'Path',
      dataIndex: 'path',
      width: '15%',
    },
    {
      title: 'Word',
      dataIndex: 'word',
      width: '20%',
    },
    {
      title: 'Translation key',
      dataIndex: 'translationKey',
      editable: true,
      width: '20%',
    },
    {
      title: 'Translation',
      dataIndex: 'translation',
      editable: true,
      width: '20%',
    },
    {
      title: 'Operations',
      dataIndex: 'operation',
      render: (_: unknown, record: TableRowItem) => (
        <Row>
          <Col flex="auto">
            <Button type="primary" onClick={() => saveEntry(record)}>
              Save
            </Button>
          </Col>
          <Col flex="auto">
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
              <Button danger>Delete</Button>
            </Popconfirm>
          </Col>
        </Row>
      ),
      width: '10%',
    },
  ];

  const handleSave = (row: TableRowItem): void => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDatasource(newData);
  };

  return (
    <Table
      bordered
      sticky
      loading={isLoading}
      pagination={{ pageSize: 100 }}
      components={components}
      rowClassName={() => 'editable-row'}
      columns={columns.map((col) => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: (record: TableRowItem) => ({
            record,
            editable: col.editable,
            dataIndex: col.dataIndex,
            title: col.title,
            handleSave,
          }),
        };
      })}
      dataSource={dataSource}
    />
  );
};

export default EditorTable;
