import { PlusOutlined } from '@ant-design/icons';
import { Button, Empty, Flex, Spin } from 'antd';
import CreateFlowModal from './create-flow-modal';
import FlowCard from './flow-card';
import { useFetchDataOnMount, useSaveFlow } from './hooks';

import styles from './index.less';

const FlowList = () => {
  const {
    showFlowSettingModal,
    hideFlowSettingModal,
    flowSettingVisible,
    flowSettingLoading,
    onFlowOk,
  } = useSaveFlow();

  const { list, loading } = useFetchDataOnMount();

  return (
    <Flex className={styles.flowListWrapper} vertical flex={1} gap={'large'}>
      <Flex justify={'end'}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showFlowSettingModal}
        >
          create canvas
        </Button>
      </Flex>
      <Spin spinning={loading}>
        <Flex gap={'large'} wrap="wrap" className={styles.flowCardContainer}>
          {list.length > 0 ? (
            list.map((item) => {
              return <FlowCard item={item} key={item.id}></FlowCard>;
            })
          ) : (
            <Empty className={styles.knowledgeEmpty}></Empty>
          )}
        </Flex>
      </Spin>
      {flowSettingVisible && (
        <CreateFlowModal
          visible={flowSettingVisible}
          onOk={onFlowOk}
          loading={flowSettingLoading}
          hideModal={hideFlowSettingModal}
          initialName=""
        ></CreateFlowModal>
      )}
    </Flex>
  );
};

export default FlowList;
