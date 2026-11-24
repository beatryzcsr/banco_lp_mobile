import { NativeTabs } from 'expo-router/native-tabs';

import { AppColors } from '@/constants/app-theme';

export default function AppTabs() {
  return (
    <NativeTabs
      backgroundColor={AppColors.cream}
      indicatorColor={AppColors.orange}
      iconColor={{ default: AppColors.wine, selected: AppColors.wine }}
      labelStyle={{ default: { color: AppColors.wine }, selected: { color: AppColors.wine } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Início</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/home.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="gramatica">
        <NativeTabs.Trigger.Label>Gramática</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/explore.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="literatura">
        <NativeTabs.Trigger.Label>Literatura</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/explore.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
