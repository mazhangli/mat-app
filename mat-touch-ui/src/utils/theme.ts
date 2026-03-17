export interface ThemeConfig {
  background: string;
  controls: {
    button: {
      background: string;
      color: string;
      borderRadius: string;
    };
    input: {
      background: string;
      borderColor: string;
      color: string;
    };
  };
}

export async function loadThemeConfig(url: string = '/theme.config.json'): Promise<ThemeConfig> {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.warn('主题配置文件加载失败，使用默认主题');
    return {
      background: '#f5f5f5',
      controls: {
        button: {
          background: '#1677FF',
          color: '#ffffff',
          borderRadius: '8px'
        },
        input: {
          background: '#ffffff',
          borderColor: '#d9d9d9',
          color: '#333333'
        }
      }
    };
  }
}

export function applyThemeConfig(config: ThemeConfig) {
  const root = document.documentElement;
  root.style.setProperty('--mat-bg-color', config.background);
  root.style.setProperty('--mat-button-bg', config.controls.button.background);
  root.style.setProperty('--mat-button-color', config.controls.button.color);
  root.style.setProperty('--mat-button-radius', config.controls.button.borderRadius);
  root.style.setProperty('--mat-input-bg', config.controls.input.background);
  root.style.setProperty('--mat-input-border', config.controls.input.borderColor);
  root.style.setProperty('--mat-input-color', config.controls.input.color);
}