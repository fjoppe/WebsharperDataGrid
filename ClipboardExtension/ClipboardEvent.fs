namespace ClipboardExtension

open WebSharper
open WebSharper.InterfaceGenerator


module Definition =

    let ClipboardEventType =
        Pattern.EnumStrings "ClipboardEventType" [ "copy"; "cut"; "paste" ]

    let DataTransfer =
        Class "DataTransfer"
        |+> Instance [
            "dropEffect" =@ T<string>
            "effectAllowed" =@ T<string>
            "types" =@ T<string[]>
            "getData" => T<string> ^-> T<string>
        ]

    let ClipboardEventConfig =
        Pattern.Config "ClipboardEventConfig"
            {
                Optional = []
                Required = 
                    [
                        "dataType", T<string>
                        "data", T<string>
                    ]
            }

    let ClipboardEvent =
        Class "ClipboardEvent"
        |=> Inherits T<JavaScript.Dom.Event>
        |+> Instance [
            "clipboardData" =? DataTransfer
        ]
        |+> Static [
            Constructor (ClipboardEventType?``type`` * ClipboardEventConfig?config)
        ]

    let Assembly =
        Assembly [
            Namespace "WebSharper.JavaScript" [
                ClipboardEventType
                DataTransfer
                ClipboardEventConfig
                ClipboardEvent
            ]
        ]

[<Sealed>]
type ClipboardExtension() =
    interface IExtension with
        member ext.Assembly =
            Definition.Assembly

[<assembly: Extension(typeof<ClipboardExtension>)>]
do ()
