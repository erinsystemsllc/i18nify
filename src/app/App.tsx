import { Descriptions, PageHeader } from 'antd';
import React, { FunctionComponent, useEffect, useState } from 'react';
import './app.scss';
import { GithubOutlined } from '@ant-design/icons';
import { Route } from 'react-router-dom';
import EditorTable from './components/EditorTable';
import { TableRowItem } from 'src/app/components/types';
import { chain, map } from 'lodash';
import axios from 'axios';

const App: FunctionComponent = () => {
  const [data, setData] = useState<TableRowItem[]>([]);

  useEffect(() => {
    axios.get(`${process.env.NODE_BACKEND_URL}/words`).then((res) => {
      const { entries } = res.data;

      const tableRowItems = chain(entries)
        .map((entry) => {
          return map(entry.words, (word, index) => ({
            key: `${entry.fileName}_${index}`,
            fileName: entry.fileName,
            path: entry.path,
            word,
            translation: '',
            translationKey: '',
          }));
        })
        .flatten()
        .value();

      setData(tableRowItems);
    });
  }, []);

  return (
    <React.Fragment>
      <Route path="/">
        <div className="main">
          <PageHeader
            ghost={false}
            className="site-page-header"
            title="i18nify"
            subTitle="Get rid of your static texts and replace them with translatable keys"
          >
            <Descriptions size="small" column={3}>
              <Descriptions.Item label="Author">Bat-Erdene Tsogoo</Descriptions.Item>
              <Descriptions.Item label="E-mail">
                <a>baterdene.tsogoo220@gmail.com</a>
              </Descriptions.Item>
              <Descriptions.Item label={<GithubOutlined height={48} width={48} />}>
                <a>batrdn</a>
              </Descriptions.Item>
              <Descriptions.Item label="Location">Ulaanbaatar, Mongolia</Descriptions.Item>
              <Descriptions.Item label="Supported files">
                JavaScript, TypeScript, HTML
              </Descriptions.Item>
            </Descriptions>
          </PageHeader>
          <EditorTable data={data} />
        </div>
      </Route>
    </React.Fragment>
  );
};

export default App;
