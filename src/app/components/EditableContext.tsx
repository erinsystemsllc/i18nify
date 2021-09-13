import React from 'react';
import { FormInstance } from 'antd';

const EditableContext = React.createContext<FormInstance<any> | null>(null);

export default EditableContext;
