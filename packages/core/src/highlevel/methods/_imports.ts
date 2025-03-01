/* eslint-disable unused-imports/no-unused-imports */

// @copy
import { tdFileId } from '@mtcute/file-id'
// @copy
import { tl } from '@mtcute/tl'

// @copy
import { RpcCallOptions } from '../../network/index.js'
// @copy
import { MaybeArray, MaybePromise, MtUnsupportedError, PartialExcept, PartialOnly } from '../../types/index.js'
// @copy
import { BaseTelegramClient, BaseTelegramClientOptions } from '../base.js'
// @copy
import { ITelegramClient } from '../client.types.js'
// @copy
import {
    AllStories,
    ArrayPaginated,
    ArrayWithTotal,
    Boost,
    BoostSlot,
    BoostStats,
    BotChatJoinRequestUpdate,
    BotCommands,
    BotReactionCountUpdate,
    BotReactionUpdate,
    BotStoppedUpdate,
    BusinessCallbackQuery,
    BusinessChatLink,
    BusinessConnection,
    BusinessMessage,
    BusinessWorkHoursDay,
    CallbackQuery,
    Chat,
    ChatEvent,
    ChatInviteLink,
    ChatInviteLinkMember,
    ChatJoinRequestUpdate,
    ChatlistPreview,
    ChatMember,
    ChatMemberUpdate,
    ChatPreview,
    ChosenInlineResult,
    CollectibleInfo,
    DeleteBusinessMessageUpdate,
    DeleteMessageUpdate,
    DeleteStoryUpdate,
    Dialog,
    FactCheck,
    FileDownloadLocation,
    FileDownloadParameters,
    ForumTopic,
    FullChat,
    FullUser,
    GameHighScore,
    HistoryReadUpdate,
    InlineCallbackQuery,
    InlineQuery,
    InputChatEventFilters,
    InputDialogFolder,
    InputFileLike,
    InputInlineResult,
    InputMediaLike,
    InputMediaSticker,
    InputMessageId,
    InputPeerLike,
    InputPrivacyRule,
    InputReaction,
    InputStarGift,
    InputStickerSet,
    InputStickerSetItem,
    InputText,
    InputWebview,
    MaybeDynamic,
    Message,
    MessageEffect,
    MessageMedia,
    MessageReactions,
    ParametersSkip2,
    ParsedUpdate,
    Peer,
    PeerReaction,
    PeersIndex,
    PeerStories,
    Photo,
    Poll,
    PollUpdate,
    PollVoteUpdate,
    PreCheckoutQuery,
    RawDocument,
    ReplyMarkup,
    SavedStarGift,
    SentCode,
    StarGift,
    StarGiftUnique,
    StarsStatus,
    StarsTransaction,
    Sticker,
    StickerSet,
    StickerSourceType,
    StickerType,
    StoriesStealthMode,
    Story,
    StoryInteractions,
    StoryUpdate,
    StoryViewer,
    StoryViewersList,
    TakeoutSession,
    TextWithEntities,
    TypingStatus,
    UploadedFile,
    UploadFileLike,
    User,
    UserStatusUpdate,
    UserTypingUpdate,
    WebPageMedia,
    WebviewResult,
} from '../types/index.js'
// @copy
import { RawUpdateInfo } from '../updates/types.js'
// @copy
import { InputStringSessionData } from '../utils/string-session.js'
