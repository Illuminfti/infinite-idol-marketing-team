# Unity Game Documentation

## Overview

The Unity package is a **WebGL** game for avatar customization and outfit management. It integrates with the React frontend via a messaging bridge and uses MessagePack for efficient data serialization.

## Technology Stack

- **Engine**: Unity 2022+
- **Platform**: WebGL
- **Serialization**: MessagePack
- **Integration**: React Bridge (jslib)

## Project Structure

```
packages/unity/
├── Assets/
│   ├── Scripts/
│   │   ├── Core/                 # Core systems
│   │   │   ├── PageManager.cs    # Page navigation
│   │   │   ├── OutfitDatabase.cs # Outfit data
│   │   │   ├── BackgroundSceneManager.cs
│   │   │   └── enums/
│   │   │       ├── PageType.cs
│   │   │       ├── Rarity.cs
│   │   │       ├── OutfitCategory.cs
│   │   │       └── AnimationCategory.cs
│   │   ├── Avatar/               # Avatar control
│   │   │   ├── PhotoModeController.cs
│   │   │   ├── PhotoCameraController.cs
│   │   │   ├── PhotoModePageController.cs
│   │   │   └── PhotoAnimationDefinition.cs
│   │   ├── Outfits/              # Equipment system
│   │   │   ├── OutfitItem.cs
│   │   │   ├── OutfitEquipManager.cs
│   │   │   ├── WardrobeSaveData.cs
│   │   │   └── WardrobeSaveService.cs
│   │   ├── Animations/           # Animation system
│   │   │   ├── AnimationDatabase.cs
│   │   │   └── AnimationItem.cs
│   │   ├── Collection/           # Collection UI
│   │   │   ├── CollectionEntry.cs
│   │   │   ├── CollectionEntryBuilder.cs
│   │   │   ├── CollectionPageUI.cs
│   │   │   ├── CollectionRowUI.cs
│   │   │   └── CollectionDisplayConfig.cs
│   │   ├── UI/                   # UI components
│   │   │   ├── OutfitListUI.cs
│   │   │   ├── OutfitButtonUI.cs
│   │   │   ├── OutfitGroupHeaderUI.cs
│   │   │   ├── UIButtonFeedback.cs
│   │   │   ├── PlayPauseToggleButton.cs
│   │   │   └── PhotoMode/
│   │   │       ├── PhotoModeUIToggle.cs
│   │   │       ├── PhotoAnimationButton.cs
│   │   │       ├── PhotoAnimationGrid.cs
│   │   │       ├── PhotoModeSliderScrub.cs
│   │   │       ├── PlaybackSpeedDropdown.cs
│   │   │       ├── WebGLScreenshot.cs
│   │   │       └── WebGLVideoToggleRecorder.cs
│   │   ├── Backend/              # Backend integration
│   │   │   ├── IEntitlementsProvider.cs
│   │   │   ├── LocalEntitlementsProvider.cs
│   │   │   └── ReactBridge/
│   │   │       ├── ReactBridge.cs
│   │   │       ├── ReactBridgeData.cs
│   │   │       ├── ReactEntitlementsProvider.cs
│   │   │       └── MessagePackHelper.cs
│   │   └── Transitions/
│   │       └── AvatarTransitionController.cs
│   ├── Plugins/
│   │   └── WebGL/
│   │       └── ReactBridge.jslib  # JavaScript interop
│   └── Resources/
├── ProjectSettings/
└── Packages/
```

## Core Systems

### PageManager
Handles navigation between pages:
```csharp
public enum PageType
{
    Avatar,
    Collection,
    PhotoMode,
    Settings
}

public class PageManager : MonoBehaviour
{
    public static PageManager Instance { get; private set; }

    public void NavigateTo(PageType page);
    public void GoBack();
    public PageType CurrentPage { get; }
}
```

### OutfitDatabase
ScriptableObject containing all outfit definitions:
```csharp
[CreateAssetMenu(fileName = "OutfitDatabase", menuName = "Infinite Idol/Outfit Database")]
public class OutfitDatabase : ScriptableObject
{
    public List<OutfitItem> AllOutfits;

    public OutfitItem GetByItemId(string itemId);
    public List<OutfitItem> GetByCategory(OutfitCategory category);
    public List<OutfitItem> GetByRarity(Rarity rarity);
}
```

### BackgroundSceneManager
Manages scene backgrounds:
```csharp
public class BackgroundSceneManager : MonoBehaviour
{
    public void SetBackground(int backgroundIndex);
    public void NextBackground();
    public void PreviousBackground();
    public int BackgroundCount { get; }
}
```

## Enums

### OutfitCategory
```csharp
public enum OutfitCategory
{
    Set = 0,        // Full outfit
    Accessory = 1,  // Accessories
    Pet = 9         // Pets
}
```

### Rarity
```csharp
public enum Rarity
{
    Common = 0,
    Uncommon = 1,
    Epic = 2,
    Mythic = 3,
    Limited = 4
}
```

### AnimationCategory
```csharp
public enum AnimationCategory
{
    Idle,
    Pose,
    Dance,
    Emote
}
```

## Outfit System

### OutfitItem
Represents an equippable item:
```csharp
[System.Serializable]
public class OutfitItem
{
    public string ItemId;         // Matches blockchain item ID
    public string DisplayName;
    public OutfitCategory Category;
    public Rarity Rarity;
    public Sprite Icon;
    public GameObject Prefab;
    public int UpgradeLevel;
}
```

### OutfitEquipManager
Handles equipment state:
```csharp
public class OutfitEquipManager : MonoBehaviour
{
    public static OutfitEquipManager Instance { get; private set; }

    // Equipment slots
    public OutfitItem EquippedSet { get; private set; }
    public OutfitItem EquippedAccessory { get; private set; }
    public OutfitItem EquippedPet { get; private set; }

    // Methods
    public void Equip(OutfitItem item);
    public void Unequip(OutfitCategory category);
    public bool IsEquipped(string itemId);
    public void SaveEquipment();
    public void LoadEquipment();

    // Events
    public event Action<OutfitItem> OnItemEquipped;
    public event Action<OutfitCategory> OnItemUnequipped;
}
```

### WardrobeSaveService
Persists equipment state:
```csharp
public class WardrobeSaveService
{
    private const string SaveKey = "wardrobe_data";

    public void Save(WardrobeSaveData data);
    public WardrobeSaveData Load();
    public void Clear();
}

[System.Serializable]
public class WardrobeSaveData
{
    public string EquippedSetId;
    public string EquippedAccessoryId;
    public string EquippedPetId;
}
```

## Animation System

### AnimationDatabase
Contains available animations:
```csharp
[CreateAssetMenu(fileName = "AnimationDatabase", menuName = "Infinite Idol/Animation Database")]
public class AnimationDatabase : ScriptableObject
{
    public List<AnimationItem> Animations;

    public AnimationItem GetByIndex(int index);
    public List<AnimationItem> GetByCategory(AnimationCategory category);
}
```

### AnimationItem
```csharp
[System.Serializable]
public class AnimationItem
{
    public string Name;
    public AnimationClip Clip;
    public AnimationCategory Category;
    public Sprite Thumbnail;
    public bool IsLooping;
}
```

## Photo Mode

### PhotoModeController
Main photo mode logic:
```csharp
public class PhotoModeController : MonoBehaviour
{
    public static PhotoModeController Instance { get; private set; }

    // State
    public bool IsPhotoModeActive { get; private set; }
    public AnimationItem CurrentAnimation { get; private set; }
    public float PlaybackSpeed { get; set; }
    public bool IsPlaying { get; private set; }

    // Control
    public void EnterPhotoMode();
    public void ExitPhotoMode();
    public void PlayAnimation(AnimationItem animation);
    public void SetPlaybackPosition(float normalizedTime);
    public void Play();
    public void Pause();
    public void SetPlaybackSpeed(float speed);

    // Events
    public event Action OnPhotoModeEnter;
    public event Action OnPhotoModeExit;
}
```

### PhotoCameraController
Camera controls in photo mode:
```csharp
public class PhotoCameraController : MonoBehaviour
{
    // Camera settings
    public float ZoomMin = 0.5f;
    public float ZoomMax = 2f;
    public float RotationSpeed = 1f;

    // Control
    public void Zoom(float delta);
    public void Rotate(float delta);
    public void Pan(Vector2 delta);
    public void ResetCamera();
}
```

### Screenshot/Video Capture
```csharp
public class WebGLScreenshot : MonoBehaviour
{
    public void CaptureScreenshot(Action<byte[]> onComplete);
    public void DownloadScreenshot(string filename = "screenshot.png");
}

public class WebGLVideoToggleRecorder : MonoBehaviour
{
    public bool IsRecording { get; private set; }

    public void StartRecording();
    public void StopRecording();
    public void DownloadVideo(string filename = "video.webm");
}
```

## Collection System

### CollectionEntry
Represents a collection item:
```csharp
[System.Serializable]
public class CollectionEntry
{
    public string ItemId;
    public OutfitItem OutfitData;
    public bool IsOwned;
    public int OwnedCount;
    public int MaxUpgradeLevel;
}
```

### CollectionPageUI
Displays the collection:
```csharp
public class CollectionPageUI : MonoBehaviour
{
    public CollectionDisplayConfig DisplayConfig;

    public void RefreshCollection();
    public void FilterByCategory(OutfitCategory? category);
    public void FilterByRarity(Rarity? rarity);
    public void FilterOwned(bool ownedOnly);
}
```

## Backend Integration

### IEntitlementsProvider
Interface for asset ownership:
```csharp
public interface IEntitlementsProvider
{
    void Initialize(Action onComplete);
    bool IsOwned(string itemId);
    int GetOwnedCount(string itemId);
    int GetMaxUpgradeLevel(string itemId);
    List<string> GetAllOwnedItemIds();
}
```

### LocalEntitlementsProvider
Mock provider for testing:
```csharp
public class LocalEntitlementsProvider : IEntitlementsProvider
{
    // Simulates ownership based on local config
    // Useful for development without blockchain
}
```

### ReactEntitlementsProvider
Production provider using React bridge:
```csharp
public class ReactEntitlementsProvider : IEntitlementsProvider
{
    private Dictionary<string, EntitlementData> _entitlements;

    public void Initialize(Action onComplete)
    {
        // Request entitlements from React
        ReactBridge.RequestEntitlements();
    }

    // Called from JavaScript when entitlements arrive
    public void ReceiveEntitlements(byte[] messagePackData)
    {
        _entitlements = MessagePackHelper.Deserialize<Dictionary<string, EntitlementData>>(messagePackData);
    }
}
```

## React Bridge

### JavaScript Interop (ReactBridge.jslib)
```javascript
mergeInto(LibraryManager.library, {
    SendMessageToReact: function(messagePtr) {
        var message = UTF8ToString(messagePtr);
        if (window.unityBridge) {
            window.unityBridge.handleUnityMessage(message);
        }
    },

    RequestEntitlementsFromReact: function() {
        if (window.unityBridge) {
            window.unityBridge.requestEntitlements();
        }
    }
});
```

### ReactBridge.cs
```csharp
public static class ReactBridge
{
    [DllImport("__Internal")]
    private static extern void SendMessageToReact(string message);

    [DllImport("__Internal")]
    private static extern void RequestEntitlementsFromReact();

    public static void SendMessage(string type, object payload)
    {
        var message = new ReactBridgeMessage { Type = type, Payload = payload };
        var json = JsonUtility.ToJson(message);
        SendMessageToReact(json);
    }

    public static void RequestEntitlements()
    {
        RequestEntitlementsFromReact();
    }

    // Called from React via SendMessage
    public static void OnEntitlementsReceived(string base64Data)
    {
        var bytes = Convert.FromBase64String(base64Data);
        ReactEntitlementsProvider.Instance.ReceiveEntitlements(bytes);
    }

    public static void OnEquipmentChanged(string itemId)
    {
        SendMessage("EQUIPMENT_CHANGED", new { itemId });
    }
}
```

### ReactBridgeData
Data structures for bridge:
```csharp
[System.Serializable]
public class ReactBridgeMessage
{
    public string Type;
    public object Payload;
}

[MessagePackObject]
public class EntitlementData
{
    [Key(0)]
    public string ItemId;

    [Key(1)]
    public int OwnedCount;

    [Key(2)]
    public int MaxUpgradeLevel;

    [Key(3)]
    public int Rarity;

    [Key(4)]
    public int Slot;
}
```

### MessagePackHelper
```csharp
public static class MessagePackHelper
{
    public static T Deserialize<T>(byte[] data)
    {
        return MessagePackSerializer.Deserialize<T>(data);
    }

    public static byte[] Serialize<T>(T obj)
    {
        return MessagePackSerializer.Serialize(obj);
    }
}
```

## React Integration

### UnityGame Component (React)
```tsx
// packages/frontend/src/components/game/UnityGame.tsx
import { Unity, useUnityContext } from "react-unity-webgl";

interface UnityGameProps {
  entitlements: AssetEntitlement[];
}

export function UnityGame({ entitlements }: UnityGameProps) {
  const { unityProvider, sendMessage, addEventListener, removeEventListener } =
    useUnityContext({
      loaderUrl: "/unity/Build.loader.js",
      dataUrl: "/unity/Build.data",
      frameworkUrl: "/unity/Build.framework.js",
      codeUrl: "/unity/Build.wasm",
    });

  // Set up bridge
  useEffect(() => {
    window.unityBridge = {
      handleUnityMessage: (message: string) => {
        const data = JSON.parse(message);
        // Handle Unity messages
      },
      requestEntitlements: () => {
        const packed = msgpack.encode(entitlements);
        const base64 = btoa(String.fromCharCode(...packed));
        sendMessage("ReactBridge", "OnEntitlementsReceived", base64);
      },
    };

    return () => {
      delete window.unityBridge;
    };
  }, [entitlements, sendMessage]);

  return <Unity unityProvider={unityProvider} className="w-full h-full" />;
}
```

## Building for WebGL

### Build Settings
1. Open Build Settings (File > Build Settings)
2. Select WebGL platform
3. Configure Player Settings:
   - Compression Format: Brotli
   - Exception Handling: Full With Stacktrace (Development)
   - Memory Size: 512MB minimum
   - Strip Engine Code: Enabled

### Build Command
```bash
# Build from command line
/path/to/Unity -batchmode -quit \
  -projectPath /path/to/unity/project \
  -executeMethod BuildScript.PerformBuild \
  -buildTarget WebGL \
  -buildPath /path/to/output
```

### Output Structure
```
Build/
├── Build.loader.js    # Unity loader
├── Build.data         # Asset data
├── Build.framework.js # Framework code
├── Build.wasm         # WebAssembly binary
└── index.html         # Template HTML
```

## Development Workflow

1. **Local Development**: Use `LocalEntitlementsProvider` for testing
2. **React Integration**: Use `ReactEntitlementsProvider` with bridge
3. **Build**: Create WebGL build
4. **Deploy**: Copy build files to frontend's `public/unity/` directory

## Performance Considerations

- Use object pooling for UI elements
- Limit draw calls with texture atlases
- Compress textures for WebGL
- Use LOD for 3D models
- Lazy load animations
- Minimize garbage collection
